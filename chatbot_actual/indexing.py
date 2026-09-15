from chatbot_actual.config import *

from langchain_community.vectorstores import SupabaseVectorStore
from langchain_openai import OpenAIEmbeddings
from supabase import create_client


class HostedSupabaseVectorStore(SupabaseVectorStore):
    def match_args(self, query, filter):
        # Existing RPCs require all three arguments. The adapter applies k
        # through PostgREST's limit; SQL LIMIT NULL leaves that limit in control.
        return {"query_embedding": query, "match_count": None, "filter": filter or {}}

embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=openai_key,
)


def _get_supabase_client():
    if not supabase_url or not supabase_service_role_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in chatbot_actual/api.env"
        )
    return create_client(supabase_url, supabase_service_role_key)

def embed(documents, model=embedding_model):
    print("--- Adding documents to Supabase vector store... ---")
    try:
        HostedSupabaseVectorStore.from_documents(
            documents,
            model,
            client=_get_supabase_client(),
            table_name=supabase_vector_table,
            query_name=supabase_vector_query,
        )
    except Exception as e:
        print("--- Error: Failed to add documents to Supabase ---")
        print(f"Reason: {e}")
        return False
    return True

def get_vector_store():
    print("--- Using Supabase vector store ---")
    try:
        vectorstore = HostedSupabaseVectorStore(
            _get_supabase_client(),
            embedding_model,
            table_name=supabase_vector_table,
            query_name=supabase_vector_query,
        )
    except Exception as e:
        print("--- Error: Failed to connect to Supabase vector store ---")
        print(f"Reason: {e}")
        raise RuntimeError("Supabase vector store is unavailable") from e
    return vectorstore
