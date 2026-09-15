import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "api.env"))

# API KEYS
openai_key = os.getenv("OPENAI_API_KEY")
langchain_key = os.getenv("LANGCHAIN_API_KEY")
huggingface_api = os.getenv("HUGGINGFACEHUB_API_TOKEN")

# Supabase vector store (keep the service-role key on the backend only)
supabase_url = os.getenv("SUPABASE_URL")
supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase_vector_table = os.getenv("SUPABASE_VECTOR_TABLE", "documents")
supabase_vector_query = os.getenv("SUPABASE_VECTOR_QUERY", "match_documents")

# DATASTORAGE
GCS_BUCKET = os.getenv("GCS_BUCKET_NAME")
VECTORSTORE = os.getenv("VECTORSTORE_DIR")
GCS_VECTORSTORE = os.getenv("GCS_VECTORSTORE_PREFIX")
DATASTORE = os.getenv("GCS_PDF_PREFIX")

# TElEGRAM
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT")
