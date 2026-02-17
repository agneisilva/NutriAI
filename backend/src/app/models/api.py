from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field

from app.models.domain import ActivityLevel, Goal, Sex


class HealthResponse(BaseModel):
    ok: bool = True
    service: str
    env: str


class StartRequest(BaseModel):
    language: Optional[str] = "pt-BR"


class StartResponse(BaseModel):
    session_id: str
    step: int
    done: bool
    message: str


class AnswerRequest(BaseModel):
    session_id: str = Field(min_length=1)
    answer: str = Field(min_length=1, max_length=500)


class NextQuestionResponse(BaseModel):
    session_id: str
    step: int
    done: bool = False
    message: str


class FinalProfile(BaseModel):
    goal: Goal
    age: int
    sex: Sex
    weight_kg: float
    height_cm: float
    activity_level: ActivityLevel
    restrictions: List[str]


class FinalResponse(BaseModel):
    session_id: str
    done: bool = True
    profile: FinalProfile
    bmi: float
    bmi_category: str
    summary: str


class ErrorResponse(BaseModel):
    detail: str
