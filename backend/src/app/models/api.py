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


class FinalPayloadProfile(BaseModel):
    sex: Optional[Sex] = None
    age: Optional[int] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    weight_change_kg: Optional[float] = None
    weight_change_period_weeks: Optional[int] = None


class FinalPayloadGoals(BaseModel):
    primary: Optional[Goal] = None
    secondary: Optional[str] = None
    priority: Optional[str] = None
    horizon: Optional[str] = None


class FinalPayloadRoutine(BaseModel):
    work_activity_level: Optional[ActivityLevel] = None
    sleep_times: Optional[str] = None
    meals_per_day: Optional[int] = None


class FinalPayloadTraining(BaseModel):
    has_training: Optional[bool] = None
    modalities: List[str] = Field(default_factory=list)
    frequency: Optional[str] = None
    duration: Optional[str] = None
    intensity: Optional[int] = None
    goal: Optional[str] = None


class FinalPayloadRestrictions(BaseModel):
    dietary_patterns: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    forbidden_foods: List[str] = Field(default_factory=list)
    legacy_restrictions: List[str] = Field(default_factory=list)


class FinalPayloadPreferences(BaseModel):
    cooking: Optional[str] = None
    budget: Optional[str] = None
    context: List[str] = Field(default_factory=list)


class FinalPayloadHealth(BaseModel):
    conditions: List[str] = Field(default_factory=list)
    meds: List[str] = Field(default_factory=list)
    sleep_score: Optional[int] = None
    hunger_score: Optional[int] = None
    energy_score: Optional[int] = None
    water_level: Optional[str] = None


class FinalAnamnesePayload(BaseModel):
    profile: FinalPayloadProfile
    goals: FinalPayloadGoals
    routine: FinalPayloadRoutine
    training: FinalPayloadTraining
    restrictions: FinalPayloadRestrictions
    preferences: FinalPayloadPreferences
    health: FinalPayloadHealth
    notes: Optional[str] = None


class FinalResponse(BaseModel):
    session_id: str
    done: bool = True
    profile: FinalProfile
    bmi: float
    bmi_category: str
    summary: str
    anamnese_payload: Optional[FinalAnamnesePayload] = None


class ErrorResponse(BaseModel):
    detail: str
