from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class Goal(str, Enum):
    lose_weight = "perder peso"
    gain_mass = "ganhar massa"
    maintain = "manter"


class Sex(str, Enum):
    male = "male"
    female = "female"
    other = "other"
    unknown = "unknown"


class ActivityLevel(str, Enum):
    sedentary = "sedentary"
    light = "light"
    moderate = "moderate"
    high = "high"


class Profile(BaseModel):
    goal: Goal
    age: int = Field(ge=1, le=120)
    sex: Sex
    weight_kg: float = Field(ge=20, le=300)
    height_cm: float = Field(ge=80, le=250)
    activity_level: ActivityLevel
    restrictions: List[str] = Field(default_factory=list)


class SessionState(BaseModel):
    session_id: str
    step: int
    data: dict
    status: str
    created_at: str
    updated_at: str
    ttl: int
    language: Optional[str] = "pt-BR"
