from config import *
from helper import handle_new_file
from loader import upload_chroma_to_cloud
from uuid import uuid4
import httpx, aiofiles, os
from video_helper import *

TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"
TELEGRAM_FILE_URL = f"https://api.telegram.org/file/bot{TELEGRAM_BOT_TOKEN}"

async def say_hello(chat_id):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{TELEGRAM_API_URL}/sendMessage",
            json={
                'chat_id': chat_id,
                'text': f"👋 Hey Genius bot is here and ready to help! \n Just a friendly reminder, once you are done with your session, send '/end' to let me know. "
            }
        )

async def main_menu(chat_id):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{TELEGRAM_API_URL}/sendMessage",
            json={
                'chat_id': chat_id,
                'text': "What would you like to do?",
                'reply_markup': {
                    'inline_keyboard': [
                        [{'text': "Add more knowledge to chatbot", 'callback_data': 'add_knowledge'}],
                        [{'text': "Generative AI Personal Assistant (Not Available Yet)", 'callback_data': 'personal_assistant'}],
                        [{'text': "End Chat", 'callback_data': 'end_chat'}]
                    ]
                }
            }
        )

async def knowledge_menu(chat_id):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{TELEGRAM_API_URL}/sendMessage",
            json = {
                'chat_id': chat_id,
                'text': "Alright, would you like to upload a file/ folder or a video link?",
                'reply_markup': {
                    'inline_keyboard': [
                        [{'text': "Upload file/ folder", 'callback_data': 'upload_file'}],
                        [{'text': "Upload video link", 'callback_data': 'upload_video_link'}]
                    ]
                }
            }
        )

async def prompt_video_link(chat_id):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{TELEGRAM_API_URL}/sendMessage",
            json={
                'chat_id' : chat_id,
                'text': "Please send the video link you'd like to add. If there are multiple links, please seperate them with commas."
            }
        )


async def prompt_file_upload(chat_id):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{TELEGRAM_API_URL}/sendMessage",
            json={
                'chat_id': chat_id,
                'text': "Please upload the file or folder you'd like to add."
            }
        )

async def send_message(chat_id, msg):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{TELEGRAM_API_URL}/sendMessage",
            json={'chat_id': chat_id, 'text': msg}
        )
async def handle_document_upload(message, chat_id):
    try:
        document = message['document']
        file_id = document['file_id']
        file_name = document.get('file_name', f"file_{uuid4().hex}")

        # Step 1: Get file path
        async with httpx.AsyncClient() as client:
            file_path_resp = await client.get(f"{TELEGRAM_API_URL}/getFile", params={'file_id': file_id})
            file_path_data = file_path_resp.json()
            if not file_path_data['ok']:
                raise Exception(f"Telegram getFile failed: {file_path_data}")
            file_path = file_path_data['result']['file_path']

            # Step 2: Download the file
            file_url = f"{TELEGRAM_FILE_URL}/{file_path}"
            download_resp = await client.get(file_url)

        # Step 3: Save the file asynchronously
        os.makedirs('temp_files', exist_ok=True)
        local_path = os.path.join("temp_files", file_name)
        async with aiofiles.open(local_path, 'wb') as f:
            await f.write(download_resp.content)

        # Step 4: Process file
        uploaded, rejected = handle_new_file(local_path)

        # Step 5: Send result
        msg = f"✅ {len(uploaded)} file(s) processed and embedded successfully!"
        if rejected:
            msg += f"\n⚠️ Rejected files: {rejected}"
        await send_message(chat_id, msg)
        await main_menu(chat_id)

    except Exception as e:
        print(f"--- Error: Failed to handle document upload ---\n{e}")
        await send_message(chat_id, "Something went wrong while processing your file. Please contact backend engineer.")

async def continue_from_previous_session(chat_id, user):
    name = user.name
    state = user.state
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{TELEGRAM_API_URL}/sendMessage",
            json={
                'chat_id': chat_id,
                'text': f"Hi {name}! Welcome back! I noticed you did not complete your last task of {state}. Would you like to continue from where you left off?",
                'reply_markup': {
                    'inline_keyboard': [
                        [{'text': 'Yes', 'callback_data': 'initialise_continue'}],
                        [{'text': 'No', 'callback_data': 'initialise_discontinue'}]
                    ]
                }
            }
        )

async def receive_video_link(chat_id, video_link: str) -> str:
    if not url_checker(video_link):
        print("---Downloading Video---")
        video_path = download_video(video_link)
        if video_path == None:
            raise Exception("Failed to download video.")
    else: video_path = video_link
    print("---Transcribing Video---")
    transcript, filename = transcribe_video(video_path)
    if transcript is None:
        raise Exception("Failed to transcribe video.")
    print("---Saving Transcript to PDF---")
    pdf_path = save_transcript_to_pdf(transcript, filename)
    print("---Handling New PDF File---")
    uploaded, rejected = handle_new_file(pdf_path)
    msg = ''
    if len(uploaded) > 0:
        msg += f"✅ {len(uploaded)} file(s) processed and embedded successfully!"
    if rejected:
        msg += f"\n⚠️ Rejected files: {rejected}"
        await send_message(chat_id, msg)
        await main_menu(chat_id)