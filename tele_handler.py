from fastapi import FastAPI, Request, BackgroundTasks
from tele_helper import *
import json
import httpx
from config import TELEGRAM_BOT_TOKEN

app = FastAPI()

class User:
    def __init__ (self, chat_id, name):
        self.chat_id = chat_id
        self.name = name
        self.state = None
    async def get_state(self):
        return self.state
    async def set_state(self, state):
        self.state = state
users = {}

async def get_user(chat_id, name):
    if chat_id not in users:
        users[chat_id] = User(chat_id, name)
    return users[chat_id]

@app.post("/telegram_webhook")
async def telegram_webhook(request: Request, background_tasks: BackgroundTasks):
    payload = await request.json()
    print(json.dumps(payload, indent=2))
    chat_id = payload.get('message', {}).get('chat', {}).get('id')
    name = payload.get('message', {}).get('from', {}).get('first_name', 'User')
    user = await get_user(chat_id, name)
    state = await user.get_state()
    print(state)

    # 1. Skip bot-originated messages (including our own)
    message = payload.get('message', {})
    if message.get('from', {}).get('is_bot', False):
        return {'status': 'ok'}

    # 2. Handle callback queries first
    if 'callback_query' in payload:
        callback = payload['callback_query']
        chat_id = callback['message']['chat']['id']
        callback_data = callback['data']

        # Answer callback first to stop loading animation
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{TELEGRAM_API_URL}/answerCallbackQuery",
                json={'callback_query_id': callback['id']}
            )

        if callback_data == 'add_knowledge':
            await knowledge_menu(chat_id)
        elif callback_data == 'personal_assistant':
            await send_message(chat_id, "Feature coming soon!")
            await main_menu(chat_id)
        elif callback_data == 'end_chat':
            await send_message(chat_id, "Session ended. Type /start to begin again.")
            await user.set_state(None)
        elif callback_data == 'upload_file':
            await prompt_file_upload(chat_id)
        elif callback_data == 'upload_video_link':
            await prompt_video_link(chat_id)
        
        return {'status': 'ok'}

    # 3. Process documents (with anti-loop protection)
    if 'document' in message:
        chat_id = message['chat']['id']

        await send_message(chat_id, "📄 Document received! Processing...")

        # Offload processing to background task
        background_tasks.add_task(handle_document_upload, message, chat_id)
        return {'status': 'ok'}

    # 4. Handle text commands
    text = message.get('text', '').strip()
    if not text:
        return {'status': 'ok'}

    chat_id = message['chat']['id']
    
    if text == '/start':
        await user.set_state('main_menu')
        await say_hello(chat_id)
        await main_menu(chat_id)
        

    
    elif text == '/end':
        await send_message(chat_id, "Session ended. Type /start to begin again.")
        await user.set_state(None)
        return {'status': 'ok'}
    
    else:
        # Only show menu if not already in a command flow
        await send_message(chat_id, "Please select an option:")
        await main_menu(chat_id)
    
    return {'status': 'ok'}