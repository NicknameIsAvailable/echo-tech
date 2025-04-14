import os
import logging
import requests
from dotenv import load_dotenv

# Загрузка переменных окружения
load_dotenv()

# Получение токена бота из переменных окружения
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID')

logger = logging.getLogger(__name__)

def send_contact_form_notification(form_data):
    """
    Отправляет уведомление о новой форме обратной связи в Telegram
    
    Args:
        form_data (dict): Данные из формы (имя, email, телефон и т.д.)
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.warning("Не настроены TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID")
        return False
        
    try:
        message = f"📨 *Новое сообщение с сайта*\n\n"
        message += f"👤 *Имя*: {form_data.get('name', 'Не указано')}\n"
        message += f"📧 *Email*: {form_data.get('email', 'Не указан')}\n"
        
        if form_data.get('phone'):
            message += f"📱 *Телефон*: {form_data.get('phone')}\n"
            
        if form_data.get('subject'):
            message += f"📝 *Тема*: {form_data.get('subject')}\n"
            
        message += f"\n💬 *Сообщение*:\n{form_data.get('message', 'Пусто')}"
        
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "Markdown"
        }
        
        response = requests.post(url, data=data)
        response.raise_for_status()
        
        return True
    except Exception as e:
        logger.error(f"Ошибка при отправке уведомления в Telegram: {str(e)}")
        return False

def send_files_to_telegram(file_paths, caption=""):
    """
    Отправляет файлы в Telegram
    
    Args:
        file_paths (list): Список путей к файлам для отправки
        caption (str): Подпись к файлам
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.warning("Не настроены TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID")
        return False
        
    if not file_paths:
        return True
        
    try:
        for file_path in file_paths:
            if not os.path.exists(file_path):
                logger.warning(f"Файл не найден: {file_path}")
                continue
                
            url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendDocument"
            
            with open(file_path, 'rb') as file:
                files = {'document': file}
                data = {
                    "chat_id": TELEGRAM_CHAT_ID,
                    "caption": caption
                }
                
                response = requests.post(url, data=data, files=files)
                response.raise_for_status()
                
        return True
    except Exception as e:
        logger.error(f"Ошибка при отправке файлов в Telegram: {str(e)}")
        return False 