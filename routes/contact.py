from flask import Blueprint, render_template, request, flash, redirect, url_for
from utils.telegram_bot import send_contact_form_notification, send_files_to_telegram
import os
import logging

logger = logging.getLogger(__name__)

contact_bp = Blueprint('contact', __name__, url_prefix='/contact')


@contact_bp.route('/', methods=['GET', 'POST'])
def index():
    """
    Обработчик маршрута для страницы контактов.
    Обрабатывает как GET-запросы (отображение формы), так и POST-запросы (обработка формы).
    """
    if request.method == 'POST':
        return handle_contact_form()

    # Статический текст для бизнес-часов
    monday_friday = 'Понедельник - Пятница'
    saturday = 'Суббота'
    sunday = 'Воскресенье'
    time_mf = '9:00 - 21:00 МСК'
    time_sat = '10:00 - 18:00 МСК'
    weekend = 'Выходной'

    # Контактная информация
    contact_info = {
        'email': 'info@echotech.ru',
        'business_hours': [
            {'days': monday_friday, 'hours': time_mf},
            {'days': saturday, 'hours': time_sat},
            {'days': sunday, 'hours': weekend}
        ]
    }

    return render_template('contact.html', contact_info=contact_info)

def handle_contact_form():
    """
    Обрабатывает отправку формы обратной связи
    """
    # Получаем данные из формы
    name = request.form.get('name', '')
    email = request.form.get('email', '')
    phone = request.form.get('phone', '')
    message = request.form.get('message', '')
    subject = request.form.get('subject', '')
    
    # Проверка на пустые обязательные поля
    if not name or not email or not message:
        flash('Пожалуйста, заполните все обязательные поля', 'danger')
        return render_template('contact.html', 
                               name=name, 
                               email=email, 
                               phone=phone, 
                               message=message,
                               subject=subject)
    
    # Получаем прикрепленные файлы
    uploaded_files = request.files.getlist('attachments[]')
    files_to_send = []
    
    # Обработка прикрепленных файлов
    if uploaded_files:
        temp_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'temp_uploads')
        os.makedirs(temp_dir, exist_ok=True)
        
        for file in uploaded_files:
            if file.filename:
                _, ext = os.path.splitext(file.filename)
                allowed_extensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']
                
                if ext.lower() in allowed_extensions:
                    temp_path = os.path.join(temp_dir, file.filename)
                    file.save(temp_path)
                    files_to_send.append(temp_path)
                else:
                    flash(_('Файл %(filename)s имеет неподдерживаемый формат и не был отправлен', filename=file.filename), 'error')
    
    try:
        form_data = {
            'name': name,
            'email': email,
            'phone': phone,
            'subject': subject,
            'message': message
        }
        send_contact_form_notification(form_data)
        
        # Отправляем файлы если они есть
        if files_to_send:
            send_files_to_telegram(files_to_send, f"Файлы к обращению от {name}")
            
            # Удаляем временные файлы после отправки
            for file_path in files_to_send:
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Ошибка при удалении временного файла {file_path}: {str(e)}")
        
        # Логируем успешную отправку
        logger.info(f"Отправлено сообщение от {name} ({email})")
        
        # Успешная отправка
        flash('Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success')
    except Exception as e:
        # Логирование ошибки в реальном приложении
        logger.error(f"Ошибка при отправке уведомления или файлов: {str(e)}")
        try:
            # Пробуем использовать перевод
            flash(_('Ваше сообщение получено, но возникли проблемы с уведомлением. Наши специалисты свяжутся с вами в ближайшее время.'), 'success')
        except Exception:
            # Если перевод не работает, выводим сообщение напрямую
            flash('Ваше сообщение получено, но возникли проблемы с уведомлением. Наши специалисты свяжутся с вами в ближайшее время.', 'success')
        
        for file_path in files_to_send:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except:
                pass
    
    return redirect(url_for('contact.index'))