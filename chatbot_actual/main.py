from chatbot_actual.loader import download_chroma_from_r2
from chatbot_actual.helper import rag_activation
from chatbot_actual.config import *
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import traceback

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

@app.post("/ask")
def main(request:QueryRequest):
    # download the vectorstore from the Google Cloud Bucket
    try:
        download_chroma_from_r2()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code = 500, detail= f"--- Error: Failed to load vectorstore --- \n Reason: {e}")
    # run the RAG pipeline
    try:
        answer = rag_activation(request.question, request.history)
        return {'answer': answer}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code = 500, detail = f"---Error: RAG pipeline failure--- \n Reason: {e}")
    