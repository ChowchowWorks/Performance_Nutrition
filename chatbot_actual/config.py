import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "api.env"))

# API KEYS
openai_key = os.getenv("OPENAI_API_KEY")
langchain_key = os.getenv("LANGCHAIN_API_KEY")
huggingface_api = os.getenv("HUGGINGFACEHUB_API_TOKEN")

# DATASTORAGE
GCS_BUCKET = os.getenv("GCS_BUCKET_NAME")
VECTORSTORE = os.getenv("VECTORSTORE_DIR")
GCS_VECTORSTORE = os.getenv("GCS_VECTORSTORE_PREFIX")
DATASTORE = os.getenv("GCS_PDF_PREFIX")
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")
VECTORSTORE_COLLECTION = os.getenv("VECTORSTORE_COLLECTION", "nutrition_documents")

# TElEGRAM
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT")
