import os
from config import *
from google.cloud import storage
from langchain_community.document_loaders import PyPDFDirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def load(file: str):
    if os.path.isdir(file):
        print("---Received Folder! Loading the folder documents now...---")
        try:
            loader = PyPDFDirectoryLoader(file)
            documents = loader.load()
        except Exception as e:
            print("--- Error: Failed to load folder documents ---")
            print(f"Reason: {e}")
            return None
    elif os.path.isfile(file):
        print("---Received File! Loading the file documents now... ---")
        try:
            loader = PyPDFLoader(file)
            documents = loader.load()
        except Exception as e: 
            print("---Error: Failed to load document ---")
            print(f"Reason: {e}")
            return None
    else: 
        print("---Error: Nothing found in this location!---")
        return None
    
    return documents

def split(documents:list):
    # check if empty list
    if not documents:
        raise Exception("--- Error: Empty List of Document. Check the previous step! ---")
    else:
        print("--- Splitting Documents Now ---")
        splitter = RecursiveCharacterTextSplitter(chunk_size = 500, chunk_overlap = 100)
        try:
            texts = splitter.split_documents(documents)
        except Exception as e:
            print("---Error: Failed to split document into chunks ---")
            print(f"Reason: {e}")
            return None
    return texts

def receive(file:str):
    # carry out loading
    documents = load(file)
    if documents == None:
        raise Exception("---Error: Document Loading failed---")
    # carry out splitting
    texts = split(documents)
    if texts == None:
        raise Exception("---Error: Document splitting failed---")
    return texts

def check_pdfs(filename):
    if not filename.lower().endswith('.pdf'):
        print(f"---Error! {filename} is not a .pdf file!")
        return False
    else:
        return True
    
def upload_files(file_path, gcs_path, bucket_name):
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    target_path = f"{gcs_path}{os.path.basename(file_path)}"
    blob = bucket.blob(target_path)
    print(blob)
    try:
        blob.upload_from_filename(file_path)
    except Exception as e:
        print(f"---Error: Failed to upload {os.path.basename(file_path)}---")
        print(f"Reason: {e}")
        return False
    return True

def upload_to_gcs(local_path, gcs_path= DATASTORE, bucket_name = GCS_BUCKET):
    # count the number of files uploaded
    uploaded_files = []
    rejected_files = []
    # if local_path points to a folder, go into the folder and upload each file individually
    if not os.path.exists(local_path):
        raise FileNotFoundError(f"---Error: Path '{local_path}' does not exist---")
    
    if os.path.isdir(local_path):
        for filename in os.listdir(local_path):
            # check if the files are PDF
            if check_pdfs(filename):
                file_path = os.path.join(local_path,filename)
                if upload_files(file_path, gcs_path, bucket_name):
                    uploaded_files.append(filename)
                else: 
                    rejected_files.append(filename)
            else:
                rejected_files.append(filename)

    # if local_path points to a file, upload the file
    elif os.path.isfile(local_path):
        filename = os.path.basename(local_path)
        # check if the file is pdf
        if check_pdfs(filename):
            if upload_files(local_path, gcs_path, bucket_name):
                uploaded_files.append(filename)
            else:
                rejected_files.append(filename)
        else:
            rejected_files.append(filename)

    return (uploaded_files, rejected_files)


def download_vectorstore_gcs(bucket_name = 'snj_chatbot_backend', destination_dir = 'chroma_db'):
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blobs = bucket.list_blobs(prefix = "chroma_db/")
    
    os.makedirs(destination_dir, exist_ok= True)

    for blob in blobs:
        blob_path = os.path.join(destination_dir, os.path.basename(blob.name))
        blob.download_to_filename(blob_path)
    return 

def upload_chroma_to_cloud():
    client = storage.Client()
    bucket = client.bucket('snj_chatbot_backend')

    try:
        for root, dirs, files in os.walk("chroma_db"):
            for file in files:
                local_file = os.path.join(root,file)
                gcs_path = os.path.join('chroma_db', os.path.relpath(local_file, "chroma_db"))
                
                blob = bucket.blob(gcs_path)
                blob.upload_from_filename(local_file)
        return True
            
    except Exception as e:
        print("---Error: Failed in Uploading Chroma_db to the Cloud---")
        print(f"Reason: {e}")
        return False
    
def upload_files_r2(file_path, r2_path, bucket_name=R2_BUCKET):
    target_path = f"{r2_path}{os.path.basename(file_path)}"
    try:
        r2_client.upload_file(file_path, bucket_name, target_path)
        return True
    except Exception as e:
        print(f"---Error: Failed to upload {os.path.basename(file_path)}---")
        print(f"Reason: {e}")
        return False
    
def upload_to_r2(local_path, r2_path="Datastore/", bucket_name=R2_BUCKET):
    uploaded_files = []
    rejected_files = []

    if not os.path.exists(local_path):
        raise FileNotFoundError(f"---Error: Path '{local_path}' does not exist---")
    
    if os.path.isdir(local_path):
        for filename in os.listdir(local_path):
            if check_pdfs(filename):
                file_path = os.path.join(local_path, filename)
                if upload_files_r2(file_path, r2_path, bucket_name):
                    uploaded_files.append(filename)
                else:
                    rejected_files.append(filename)
            else:
                rejected_files.append(filename)

    elif os.path.isfile(local_path):
        filename = os.path.basename(local_path)
        if check_pdfs(filename):
            if upload_files_r2(local_path, r2_path, bucket_name):
                uploaded_files.append(filename)
            else:
                rejected_files.append(filename)
        else:
            rejected_files.append(filename)

    return (uploaded_files, rejected_files)

def download_chroma_from_r2(bucket_name=R2_BUCKET, prefix="chroma_db/", destination_dir="chroma_db"):
    os.makedirs(destination_dir, exist_ok=True)
    
    response = r2_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

    if "Contents" in response:
        for obj in response["Contents"]:
            key = obj["Key"]
            local_path = os.path.join(destination_dir, os.path.basename(key))
            try:
                r2_client.download_file(bucket_name, key, local_path)
            except Exception as e:
                print(f"Failed to download {key}: {e}")

def upload_chroma_to_r2():
    try:
        for root, dirs, files in os.walk("chroma_db"):
            for file in files:
                local_file = os.path.join(root, file)
                r2_path = os.path.join('chroma_db', os.path.relpath(local_file, "chroma_db"))
                
                r2_client.upload_file(local_file, R2_BUCKET, r2_path)
        return True
            
    except Exception as e:
        print("---Error: Failed in Uploading Chroma_db to R2---")
        print(f"Reason: {e}")
        return False