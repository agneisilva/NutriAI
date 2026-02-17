from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class StepDef:
    field: str
    question: str
    error_hint: str


STEPS: list[StepDef] = [
    StepDef("goal", "Qual é seu objetivo principal? (perder peso / ganhar massa / manter)", "Responda com: perder peso, ganhar massa ou manter."),
    StepDef("age", "Qual sua idade em anos?", "Informe um número inteiro, ex: 34."),
    StepDef("sex", "Qual seu sexo? (male/female/other/unknown). Pode responder 'pular'.", "Responda com male, female, other ou unknown."),
    StepDef("weight_kg", "Qual seu peso em kg? (20 a 300)", "Informe um número entre 20 e 300, ex: 82."),
    StepDef("height_cm", "Qual sua altura em cm? (80 a 250)", "Informe um número entre 80 e 250, ex: 175."),
    StepDef("activity_level", "Qual seu nível de atividade? (sedentary/light/moderate/high)", "Responda com sedentary, light, moderate ou high."),
    StepDef("restrictions", "Tem alguma restrição alimentar? (texto livre, pode vazio)", "Pode informar uma lista separada por vírgulas, ou vazio."),
]


def total_steps() -> int:
    return len(STEPS)


def question_for_step(step: int) -> str:
    return STEPS[step - 1].question


def field_for_step(step: int) -> str:
    return STEPS[step - 1].field


def error_hint_for_step(step: int) -> str:
    return STEPS[step - 1].error_hint


def _parse_float(text: str) -> float | None:
    sanitized = text.strip().lower().replace(",", ".")
    m = re.search(r"-?\d+(?:\.\d+)?", sanitized)
    if not m:
        return None
    try:
        return float(m.group(0))
    except ValueError:
        return None


def _parse_int(text: str) -> int | None:
    m = re.search(r"\d+", text.strip())
    if not m:
        return None
    try:
        return int(m.group(0))
    except ValueError:
        return None


def _norm_goal(value: str) -> str | None:
    v = value.strip().lower()
    if "per" in v and "peso" in v:
        return "perder peso"
    if "gan" in v and ("massa" in v or "mus" in v):
        return "ganhar massa"
    if "mant" in v:
        return "manter"
    if v in {"perder peso", "ganhar massa", "manter"}:
        return v
    return None


def _norm_sex(value: str) -> str | None:
    v = value.strip().lower()
    mapping = {
        "male": "male",
        "masculino": "male",
        "m": "male",
        "female": "female",
        "feminino": "female",
        "f": "female",
        "other": "other",
        "outro": "other",
        "unknown": "unknown",
        "nao sei": "unknown",
        "não sei": "unknown",
        "pular": "unknown",
        "skip": "unknown",
    }
    return mapping.get(v)


def _norm_activity(value: str) -> str | None:
    v = value.strip().lower()
    mapping = {
        "sedentary": "sedentary",
        "sedentario": "sedentary",
        "sedentário": "sedentary",
        "light": "light",
        "leve": "light",
        "moderate": "moderate",
        "moderada": "moderate",
        "moderado": "moderate",
        "high": "high",
        "alta": "high",
        "alto": "high",
    }
    return mapping.get(v)


def _norm_restrictions(value: str) -> list[str]:
    if not value or value.strip() in {"-", "nenhuma", "nada"}:
        return []
    parts = [p.strip() for p in value.split(",")]
    return [p for p in parts if p]


def deterministic_normalize(field: str, answer: str) -> dict[str, Any]:
    if field == "goal":
        normalized = _norm_goal(answer)
        if normalized:
            return {"value": normalized, "is_valid": True, "reason": "ok", "followup_question": ""}
        return {"value": None, "is_valid": False, "reason": "goal_invalid", "followup_question": "Escolha: perder peso, ganhar massa ou manter."}

    if field == "age":
        value = _parse_int(answer)
        if value is not None and 1 <= value <= 120:
            return {"value": value, "is_valid": True, "reason": "ok", "followup_question": ""}
        return {"value": None, "is_valid": False, "reason": "age_invalid", "followup_question": "Informe sua idade em anos, ex: 34."}

    if field == "sex":
        value = _norm_sex(answer)
        if value:
            return {"value": value, "is_valid": True, "reason": "ok", "followup_question": ""}
        return {"value": None, "is_valid": False, "reason": "sex_invalid", "followup_question": "Responda male/female/other/unknown (ou pular)."}

    if field == "weight_kg":
        value = _parse_float(answer)
        if value is not None and 20 <= value <= 300:
            return {"value": round(value, 2), "is_valid": True, "reason": "ok", "followup_question": ""}
        return {"value": None, "is_valid": False, "reason": "weight_invalid", "followup_question": "Informe peso em kg entre 20 e 300, ex: 82."}

    if field == "height_cm":
        value = _parse_float(answer)
        if value is not None and 80 <= value <= 250:
            return {"value": round(value, 2), "is_valid": True, "reason": "ok", "followup_question": ""}
        return {"value": None, "is_valid": False, "reason": "height_invalid", "followup_question": "Informe altura em cm entre 80 e 250, ex: 175."}

    if field == "activity_level":
        value = _norm_activity(answer)
        if value:
            return {"value": value, "is_valid": True, "reason": "ok", "followup_question": ""}
        return {"value": None, "is_valid": False, "reason": "activity_invalid", "followup_question": "Use: sedentary, light, moderate ou high."}

    if field == "restrictions":
        return {"value": _norm_restrictions(answer), "is_valid": True, "reason": "ok", "followup_question": ""}

    return {"value": None, "is_valid": False, "reason": "unknown_field", "followup_question": "Resposta inválida."}
