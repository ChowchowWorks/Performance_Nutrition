import requests
from chatbot_actual.config import TELEGRAM_BOT_TOKEN

url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook"
params = {"url": "https://telegram-webhook-2vjm.onrender.com/telegram_webhook"}
response = requests.post(url, params=params)
print(response.json())