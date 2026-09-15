"""Read-only live Supabase + OpenAI test. Run from the repository root."""
import argparse
import json
from unittest.mock import patch

from fastapi.testclient import TestClient

from chatbot_actual import main as api
from chatbot_actual.config import supabase_vector_table
from chatbot_actual.indexing import _get_supabase_client


def run():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--question", help="Optional question; otherwise query a stored excerpt.")
    args = parser.parse_args()
    rows = _get_supabase_client().table(supabase_vector_table).select(
        "content,metadata", count="exact"
    ).limit(1).execute()
    if not rows.data:
        raise RuntimeError("Supabase documents table is empty")
    print(f"Supabase document chunks: {rows.count}")
    question = args.question or (
        "Explain this passage from the knowledge base: " + rows.data[0]["content"][:500]
    )
    contexts = []
    original = api.retrieve_knowledge_context

    def capture(question, limit=5):
        context = original(question, limit)
        contexts.append(context)
        return context

    with patch.object(api, "retrieve_knowledge_context", side_effect=capture):
        with TestClient(api.app) as client:
            response = client.post("/ask", json={
                "question": question, "history": [], "user_data": {}
            })
    response.raise_for_status()
    if not contexts or not contexts[0]:
        raise RuntimeError("Request succeeded but no documents passed the 0.6 relevance threshold")
    answer = response.json().get("answer")
    if not answer:
        raise RuntimeError("Request returned no answer")
    print(json.dumps({"question": question, "context_characters": len(contexts[0]),
                      "answer": answer}, ensure_ascii=True, indent=2))
    print("PASS: /ask retrieved hosted Supabase content and generated an answer; no local vector DB used.")


if __name__ == "__main__":
    run()
