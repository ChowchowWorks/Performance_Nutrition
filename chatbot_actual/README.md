# Hosted chatbot testing

The website calls FastAPI `/ask`. FastAPI embeds the question using OpenAI,
retrieves document chunks from hosted Supabase, and generates the answer.
No local Chroma database, PDF folder, or GCS download is needed to serve chat.

From the repository root:

```powershell
python -m pip install -r chatbot_actual/requirements-api.txt
python -m chatbot_actual.smoke_test
python -m chatbot_actual.smoke_test --question "Your document-specific question"
python -m uvicorn chatbot_actual.main:app --host 0.0.0.0 --port 8000
```

The smoke test reads existing rows and calls OpenAI (normal API charges apply).
It fails if `/ask` produces no answer or retrieves no context above the current
0.6 similarity threshold. Its default question uses an existing document excerpt
to verify the retrieval plumbing; use your own questions to evaluate relevance.
It never uploads documents or starts a local vector database.

Set `OPENAI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in
`api.env` for development, or in the backend hosting service's environment.
Optional settings are `SUPABASE_VECTOR_TABLE` and `SUPABASE_VECTOR_QUERY`.
Stored embeddings must use the same `text-embedding-3-small` model (1536 dimensions).
The SQL in `supabase_vector_store.sql` defines the table and search function;
the backend explicitly supplies all RPC arguments for compatibility with existing
functions, while the adapter's PostgREST limit controls the result count.

## Run the website locally

Keep the backend running on port 8000 using the command above. In a second
terminal, from the repository root:

```powershell
npm.cmd --prefix react_app run dev
```

Open the URL Vite prints, log in, and open AI Coach. Ask a question about your
documents. In browser Network tools, confirm the POST goes to
`http://localhost:8000/ask` and returns HTTP 200. That is the website's default API
URL; no extra frontend setting is needed. The Python backend connects directly
to hosted Supabase using `api.env`. Do not start Chroma or download a vector DB.
Keep the Supabase service-role key and OpenAI key on the backend.
