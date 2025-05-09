## Описание проекта

- Главная страница с презентацией услуг компании
- Страницу услуг
- Страницу контактов для связи с компанией
- Страницу условий и положений
- Страницы с подробной информацией о услугах для бизнеса и частных лиц

## Стек

- **Python 3**
- **Flask 2.3.3**
- **HTML5/CSS3**
- **JavaScript**

### Библиотеки и расширения


#### Инструменты для работы со статическими файлами
- **cssmin 0.2.0**
- **jsmin 3.0.1**

#### Другие библиотеки
- **python-telegram-bot** 
- **python-dotenv 1.0.0** 
- **pytz 2023.3**с
- **requests 2.31.0**

## Фронтенд

### Структура фронтенда
Шаблонизатор Jinja2, HTML5, CSS3 и JavaScript.

### Шаблоны (templates/)
- **index.html** - шаблон главной страницы
- **services/**
  - **index.html** - обзор всех услуг
  - **business.html** - услуги для бизнеса
  - **personal.html** - услуги для частных лиц
- **contact.html** - страница с контактной формой
- **terms.html** - страница с условиями и положениями
- **error/** - шаблоны страниц ошибок (404, 500, 413, 429)

### Стили (static/css/)
- **style.css** - основные стили сайта
  - Адаптивная сетка для разных экранов
  - Стилизация форм и кнопок
  - Анимации и переходы
- **dark-theme.css** - стили для темной темы
- **light-theme.css** - стили для светлой темы
- осталньные файлы я пытался пофиксить кнопки и баги 


### JavaScript (static/js/)
- **main.js** - основной JavaScript файл
  - Инициализация всех компонентов
  - Обработка форм и AJAX-запросов
- **theme-switcher.js** - логика переключения между темной и светлой темами
  - Сохранение предпочтений пользователя в cookies
  - Применение соответствующих стилей
- **animations.js** - анимации элементов страницы
  - Анимации при прокрутке
  - Появление элементов при загрузке страницы


## Бекенд

### Точка входа и конфигурация
- **main.py** - запуск приложения и настройка сервера
- **app.py** - основной файл приложения с инициализацией Flask
  - Регистрация blueprints
  - Настройка расширений (Assets, Babel)
  - Глобальные обработчики
- **config.py** - конфигурации для разных окружений
  - Настройки безопасности
  - Параметры загрузки файлов
  - Локализация и переводы


### Утилиты и вспомогательные модули (utils/)
- **telegram_bot.py** - взаимодействие с Telegram API
  - Отправка уведомлений о новых контактных запросах
  - Форматирование сообщений для Telegram
- **form_validators.py** - валидаторы форм
- **security.py** - функции безопасности
  - Защита от CSRF
  - Санитизация пользовательского ввода

### Обработка файлов и загрузки
- **temp_uploads/** - временное хранилище загружаемых файлов
  - Автоматическая обработка загруженных файлов
  - Очистка временных файлов по расписанию

### Интеграции
- **Telegram** - мгновенные уведомления о запросах
- **Email** - отправка подтверждений и уведомлений

## Структура проекта и назначение файлов

### Корневые файлы
- **main.py** - точка входа для запуска сервера
  - Импортирует приложение Flask из app.py
  - Запускает сервер на указанном порту
  
- **app.py** - основной файл приложения Flask
  - Инициализация Flask и его расширений (Flask-Assets, Flask-Babel)
  - Регистрация blueprints для маршрутизации
  - Настройка обработчиков ошибок (404, 500, 413, 403, 429)
  - Определение вспомогательных маршрутов (переключение темы, robots.txt, sitemap.xml)
  
- **config.py** - конфигурация приложения

- **requirements.txt** 

### Директории

#### routes/
Модули с маршрутами для различных разделов сайта:
- **home.py** - маршруты и обработчики для главной страницы (/)
- **services.py** - маршруты и обработчики для страниц услуг (/services)
- **contact.py** - маршруты и обработчики для страницы контактов (/contact)
- **terms.py** - маршруты и обработчики для страницы условий и положений (/terms)


#### utils/
Вспомогательные утилиты и функции:
- **telegram_bot.py** - модуль для отправки уведомлений в Telegram
- **__init__.py** - инициализация пакета utils

#### temp_uploads/
Временная директория для загружаемых пользователями файлов
