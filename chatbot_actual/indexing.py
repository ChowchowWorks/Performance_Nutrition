from chatbot_actual.loader import *
from chatbot_actual.config import *

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings

embedding_model = OpenAIEmbeddings(openai_api_key = openai_key)

def _supabase_vectorstore(model):
    if not SUPABASE_DB_URL:
        return None

    from langchain_postgres import PGVector

    return PGVector(
        embeddings=model,
        collection_name=VECTORSTORE_COLLECTION,
        connection=SUPABASE_DB_URL,
        use_jsonb=True,
    )

def embed(documents, persist_directory='chroma_db', model=embedding_model):
    if SUPABASE_DB_URL:
        try:
            vectorstore = _supabase_vectorstore(model)
            vectorstore.add_documents(documents)
            print("---Documents embedded into Supabase pgvector---")
            return True
        except Exception as e:
            print("--- Error: Failed to add documents to Supabase pgvector ---")
            print(f"Reason: {e}")
            return False

    # check if there is an existing vector store
    if not os.path.exists(persist_directory) or not os.listdir(persist_directory):
        # if no: create
        print("---No Existing vector store found. Creating a new one...---")
        try:
            vectorstore = Chroma.from_documents(documents, model, persist_directory= persist_directory)
        except Exception as e:
            print("--- Error: Failed to create vector store --- ")
            print(f"Reason: {e}")
            return False
        # else update the vectorstore
    else:
        print("---Existing vectorstore found. Loading and Updating... ---")
        try:
            vectorstore = Chroma(persist_directory= persist_directory, embedding_function= model)
            vectorstore.add_documents(documents)
        except Exception as e:
            print("--- Error: Failed to add documents ---")
            print(f"Reason: {e}")
            return False
    return True

def get_vector_store(persist_dir = 'chroma_db'): # set the vectorstore as the chroma_db in the environment
    if SUPABASE_DB_URL:
        try:
            print("--- Supabase pgvector store found!---")
            return _supabase_vectorstore(embedding_model)
        except Exception as e:
            print("---Error: Failed to retrieve Supabase pgvector store ---")
            print(f"Reason: {e}")
            return None

    # check if db exists
    if not os.path.exists(persist_dir) or not os.listdir(persist_dir):
        print("--- No vectorstore found at this location ---")
        return None
    embedding_model = OpenAIEmbeddings(openai_api_key = openai_key)
    print("--- Vector Store Found!---")
    try:
        vectorstore = Chroma(persist_directory= persist_dir , embedding_function=embedding_model)
    except Exception as e:
        print("---Error: Failed to retrieve vector store ---")
        print("Reason: {e}")
    return vectorstore
