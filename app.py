import os
import logging
from flask import Flask, render_template, request, session, g, make_response, redirect, flash
from flask_assets import Environment, Bundle
from flask_babel import Babel
from config import get_config
from datetime import datetime
import secrets

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = Flask(__name__)

config = get_config()
app.config.from_object(config)

# Установка секретного ключа для сессий
app.secret_key = os.environ.get('SECRET_KEY') or secrets.token_hex(16)

def get_locale():
    return 'ru'

babel = Babel(app, locale_selector=get_locale)

assets = Environment(app)
assets.debug = app.debug

css = Bundle('css/style.css', 'css/dark-theme.css', 
             filters='cssmin', output='gen/packed.css')
js = Bundle('js/main.js', 'js/theme-switcher.js', 'js/animations.js', 'js/visualizations.js',
            filters='jsmin', output='gen/packed.js')

assets.register('css_all', css)
assets.register('js_all', js)

# Добавляем UPLOAD_FOLDER в конфигурацию, если его нет
if 'UPLOAD_FOLDER' not in app.config:
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'temp_uploads')

# Создаем папку для загрузки файлов, если она не существует
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

from routes.home import home_bp
from routes.services import services_bp
from routes.contact import contact_bp
from routes.terms import terms_bp

app.register_blueprint(home_bp)
app.register_blueprint(services_bp)
app.register_blueprint(contact_bp)
app.register_blueprint(terms_bp)

@app.errorhandler(404)
def page_not_found(e):
    logger.warning(f"404 Page not found: {request.path}")
    return render_template('error/404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    logger.error(f"500 Internal Server Error: {str(e)}", exc_info=True)
    return render_template('error/500.html'), 500

@app.errorhandler(413)
def request_entity_too_large(e):
    logger.warning(f"413 Request Entity Too Large: {request.path}")
    return render_template('error/413.html', error="Размер загружаемого файла превышает допустимый лимит"), 413

@app.errorhandler(403)
def forbidden(e):
    logger.warning(f"403 Forbidden: {request.path}")
    return render_template('error/403.html'), 403

@app.context_processor
def utility_processor():
    def get_current_year():
        return datetime.now().year
    
    return dict(
        get_current_year=get_current_year
    )

@app.route('/switch-theme')
def switch_theme():
    """Переключение между светлой и темной темой"""
    current_theme = request.cookies.get('theme', 'light')
    new_theme = 'dark' if current_theme == 'light' else 'light'
    
    # Получаем URL для возврата
    referrer = request.referrer
    if not referrer or not referrer.startswith(request.host_url):
        referrer = '/'
    
    # Создаем ответ с редиректом
    response = make_response(redirect(referrer))
    
    # Устанавливаем cookie с темой
    response.set_cookie('theme', new_theme, max_age=31536000)
    
    return response

@app.route('/robots.txt')
def robots():
    return app.send_static_file('robots.txt')

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/sitemap.xml')
def sitemap():
    return app.send_static_file('sitemap.xml')

@app.errorhandler(429)
def too_many_requests(e):
    logger.warning(f"429 Too Many Requests: {request.path}")
    return render_template('error/429.html', error="Слишком много запросов. Пожалуйста, попробуйте позже."), 429


