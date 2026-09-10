from chatbot_actual.config import openai_key
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
import json
import traceback
from statistics import mean

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HANDLING THE ANSWERING OF USER QUERY#
class QueryRequest(BaseModel):
    question: str
    history: list[dict[str, str]]
    user_data: dict


llm = None
if openai_key:
    llm = ChatOpenAI(model="gpt-4.1-nano", temperature=0.2, max_tokens=1024, api_key=openai_key)


def _total(records, field):
    return sum(record.get(field) or 0 for record in records)


def build_user_context(user_data):
    workouts = user_data.get("workouts") or []
    nutrition = user_data.get("nutrition") or []

    workout_durations = [record.get("duration") for record in workouts if record.get("duration") is not None]
    nutrition_dates = [record.get("date") for record in nutrition if record.get("date")]

    return {
        "goals": user_data.get("goals"),
        "summary": {
            "workout_count": len(workouts),
            "total_workout_minutes": _total(workouts, "duration"),
            "total_workout_calories": _total(workouts, "calories"),
            "total_steps": _total(workouts, "step_count"),
            "average_workout_minutes": round(mean(workout_durations), 1) if workout_durations else 0,
            "nutrition_log_count": len(nutrition),
            "total_calories": _total(nutrition, "calories"),
            "total_protein": _total(nutrition, "protein"),
            "total_carbs": _total(nutrition, "carbs"),
            "total_fat": _total(nutrition, "fat"),
            "total_water": _total(nutrition, "water"),
            "latest_logged_date": max(nutrition_dates) if nutrition_dates else None,
            "latest_weight": next(
                (record.get("weight") for record in nutrition if record.get("weight") is not None),
                None
            )
        },
        "recent_workouts": workouts[:30],
        "recent_nutrition": nutrition[:30]
    }

@app.post("/ask")
def main(request:QueryRequest):
    if llm is None:
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY is missing in chatbot_actual/api.env"
        )

    try:
        compact_context = build_user_context(request.user_data)
        recent_history = request.history[-12:]

        response = llm.invoke([
            {
                "role": "system",
                "content": (
                    "You are a personal performance nutrition coach. "
                    "Answer using the user's logged data when relevant. "
                    "Be clear about trends and calculations, and do not invent records. "
                    "If there is not enough data, say what is missing. "
                    "The user data is private context for this request."
                )
            },
            *recent_history,
            {
                "role": "user",
                "content": (
                    f"User logged data:\n{json.dumps(compact_context, default=str)}\n\n"
                    f"Question: {request.question}"
                )
            }
        ])
        answer = response.content
        if not isinstance(answer, str):
            answer = str(answer)
        return {"answer": answer}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI Coach failure: {e}")
    