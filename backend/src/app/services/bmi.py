from __future__ import annotations


def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    height_m = height_cm / 100.0
    return round(weight_kg / (height_m * height_m), 2)


def bmi_category(bmi: float) -> str:
    if bmi < 18.5:
        return "Abaixo do peso"
    if bmi < 25:
        return "Normal"
    if bmi < 30:
        return "Sobrepeso"
    return "Obesidade"
