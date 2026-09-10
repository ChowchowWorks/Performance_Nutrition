import os
import boto3
from dotenv import load_dotenv

load_dotenv("api.env")

# API KEYS
openai_key = os.getenv("OPENAI_API_KEY")
langchain_key = os.getenv("LANGCHAIN_API_KEY")
huggingface_api = os.getenv("HUGGINGFACEHUB_API_TOKEN")

# DATASTORAGE
GCS_BUCKET = os.getenv("GCS_BUCKET_NAME")
VECTORSTORE = os.getenv("VECTORSTORE_DIR")
GCS_VECTORSTORE = os.getenv("GCS_VECTORSTORE_PREFIX")
DATASTORE = os.getenv("GCS_PDF_PREFIX")

# TElEGRAM
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT")

#CLOUDFLARE
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_ENDPOINT = os.getenv("R2_ENDPOINT") 
R2_BUCKET = os.getenv("R2_BUCKET")  

r2_client = boto3.client(
    's3',
    aws_access_key_id=R2_ACCESS_KEY,
    aws_secret_access_key=R2_SECRET_KEY,
    endpoint_url=R2_ENDPOINT,
    region_name='auto' 
)