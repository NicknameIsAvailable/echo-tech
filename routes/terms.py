from flask import Blueprint, render_template
from flask_babel import _
from datetime import datetime

terms_bp = Blueprint('terms', __name__, url_prefix='/terms')


@terms_bp.route('/')
def index():
    """
    Обработчик маршрута для страницы пользовательского соглашения.
    """
    current_date = datetime.now().strftime('%d.%m.%Y')
    return render_template('terms.html', current_date=current_date) 