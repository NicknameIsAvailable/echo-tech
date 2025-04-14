import os
from datetime import timedelta
from dotenv import load_dotenv

# Загрузка переменных окружения из .env файла
load_dotenv()

class Config:
    """Базовая конфигурация для приложения"""
    # Основные настройки
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = False
    TESTING = False
    
    # Настройки сессии
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)
    
    # Загрузка файлов
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 МБ
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'temp_uploads')
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx'}
    
    # Настройки для Babel
    BABEL_DEFAULT_LOCALE = 'ru'
    BABEL_SUPPORTED_LOCALES = ['ru']
    BABEL_TRANSLATION_DIRECTORIES = 'translations'
    
    # Порт для сервера
    PORT = int(os.environ.get('PORT', 5000))


class DevelopmentConfig(Config):
    """Конфигурация для разработки"""
    DEBUG = True


class TestingConfig(Config):
    """Конфигурация для тестирования"""
    TESTING = True


class ProductionConfig(Config):
    """Конфигурация для продакшена"""
    # Проверяем SECRET_KEY из переменных окружения
    env_key = os.environ.get('SECRET_KEY')
    if env_key:
        SECRET_KEY = env_key


# Конфигурация в зависимости от окружения
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Получение конфигурации на основе переменной окружения"""
    env = os.environ.get('FLASK_ENV', 'default')
    return config.get(env) 