from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException

from app.models.api import (
    AnswerRequest,
    FinalAnamnesePayload,
    FinalPayloadGoals,
    FinalPayloadHealth,
    FinalPayloadPreferences,
    FinalPayloadProfile,
    FinalPayloadRestrictions,
    FinalPayloadRoutine,
    FinalPayloadTraining,
    FinalResponse,
    NextQuestionResponse,
    StartRequest,
    StartResponse,
)
from app.models.domain import Profile
from app.services.anamnese_flow import (
    deterministic_normalize,
    error_hint_for_step,
    field_for_step,
    question_for_step,
    total_steps,
)
from app.services.bmi import bmi_category, calculate_bmi
from app.services.ddb import create_session, get_session, mark_done, update_session
from app.services.llm_gemini import GeminiClient

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1/anamnese", tags=["anamnese"])
llm = GeminiClient()


def _build_anamnese_payload(profile: Profile, data: dict) -> FinalAnamnesePayload:
    return FinalAnamnesePayload(
        profile=FinalPayloadProfile(
            sex=profile.sex,
            age=profile.age,
            height_cm=profile.height_cm,
            weight_kg=profile.weight_kg,
            weight_change_kg=None,
            weight_change_period_weeks=None,
        ),
        goals=FinalPayloadGoals(
            primary=profile.goal,
            secondary=None,
            priority=None,
            horizon=None,
        ),
        routine=FinalPayloadRoutine(
            work_activity_level=profile.activity_level,
            sleep_times=None,
            meals_per_day=None,
        ),
        training=FinalPayloadTraining(
            has_training=None,
            modalities=[],
            frequency=None,
            duration=None,
            intensity=None,
            goal=None,
        ),
        restrictions=FinalPayloadRestrictions(
            dietary_patterns=[],
            allergies=[],
            forbidden_foods=[],
            legacy_restrictions=list(profile.restrictions or data.get("restrictions", [])),
        ),
        preferences=FinalPayloadPreferences(
            cooking=None,
            budget=None,
            context=[],
        ),
        health=FinalPayloadHealth(
            conditions=[],
            meds=[],
            sleep_score=None,
            hunger_score=None,
            energy_score=None,
            water_level=None,
        ),
        notes=None,
    )


def _validate_field_range(field: str, value):
    if field == "age" and not (1 <= int(value) <= 120):
        raise ValueError("age_out_of_range")
    if field == "weight_kg" and not (20 <= float(value) <= 300):
        raise ValueError("weight_out_of_range")
    if field == "height_cm" and not (80 <= float(value) <= 250):
        raise ValueError("height_out_of_range")


@router.post("/start", response_model=StartResponse)
def start(req: StartRequest | None = None) -> StartResponse:
    try:
        language = (req.language if req else None) or "pt-BR"
        session = create_session(language=language)
        return StartResponse(
            session_id=session["session_id"],
            step=1,
            done=False,
            message=question_for_step(1),
        )
    except Exception:
        logger.exception("failed_to_start_session")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/answer", response_model=NextQuestionResponse | FinalResponse)
def answer(req: AnswerRequest) -> NextQuestionResponse | FinalResponse:
    try:
        session = get_session(req.session_id)
        if not session:
            raise HTTPException(status_code=400, detail="Session not found")
        if session.get("status") == "DONE":
            raise HTTPException(status_code=400, detail="Session already completed")

        step = int(session.get("step", 1))
        if step < 1 or step > total_steps():
            raise HTTPException(status_code=500, detail="Invalid session state")

        field = field_for_step(step)
        llm_result = llm.normalize_answer(field=field, user_answer=req.answer)
        normalized = llm_result if llm_result else deterministic_normalize(field=field, answer=req.answer)

        if not normalized.get("is_valid"):
            followup = normalized.get("followup_question") or error_hint_for_step(step)
            return NextQuestionResponse(
                session_id=req.session_id,
                step=step,
                done=False,
                message=followup,
            )

        value = normalized.get("value")

        if field == "age":
            value = int(value)
        elif field in {"weight_kg", "height_cm"}:
            value = float(value)
        elif field == "restrictions":
            if value is None:
                value = []
            elif isinstance(value, str):
                value = [part.strip() for part in value.split(",") if part.strip()]
            elif isinstance(value, list):
                value = [str(part).strip() for part in value if str(part).strip()]
            else:
                raise ValueError("restrictions_invalid")

        _validate_field_range(field, value)

        current_data = session.get("data", {})
        current_data[field] = value

        if step < total_steps():
            new_step = step + 1
            update_session(req.session_id, {"step": new_step, "data": current_data})
            return NextQuestionResponse(
                session_id=req.session_id,
                step=new_step,
                done=False,
                message=question_for_step(new_step),
            )

        profile = Profile(**current_data)
        bmi_value = calculate_bmi(weight_kg=profile.weight_kg, height_cm=profile.height_cm)
        category = bmi_category(bmi_value)
        summary = (
            f"Objetivo: {profile.goal.value}. IMC: {bmi_value} ({category}). "
            f"Atividade: {profile.activity_level.value}."
        )

        mark_done(req.session_id, {"step": total_steps(), "data": profile.model_dump()})
        return FinalResponse(
            session_id=req.session_id,
            done=True,
            profile=profile.model_dump(),
            bmi=bmi_value,
            bmi_category=category,
            summary=summary,
            anamnese_payload=_build_anamnese_payload(profile=profile, data=current_data),
        )

    except HTTPException:
        raise
    except ValueError as exc:
        logger.warning("invalid_answer field_error=%s", str(exc))
        raise HTTPException(status_code=400, detail="Invalid answer format/range")
    except Exception:
        logger.exception("failed_to_process_answer")
        raise HTTPException(status_code=500, detail="Internal server error")
