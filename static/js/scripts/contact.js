document.addEventListener('DOMContentLoaded', function() {
    // Валидация формы
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        // Анимация появления полей формы
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            setTimeout(() => {
                group.style.transition = 'all 0.5s ease';
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
        
        // Улучшенная анимация для загрузки файлов
        const fileUpload = document.querySelector('.file-upload');
        if (fileUpload) {
            // Инициализируем хранилище файлов
            fileUpload._selectedFiles = null;
            
            const fileUploadWrapper = document.querySelector('.file-upload-wrapper');
            const fileUploadLabel = document.querySelector('.file-upload-label');
            
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                fileUploadLabel.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            ['dragenter', 'dragover'].forEach(eventName => {
                fileUploadLabel.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                fileUploadLabel.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight() {
                fileUploadWrapper.classList.add('drag-active');
            }
            
            function unhighlight() {
                fileUploadWrapper.classList.remove('drag-active');
            }
            
            fileUploadLabel.addEventListener('drop', handleDrop, false);
            
            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                handleFiles(files);
            }
            
            function handleFiles(files) {
                // Имитируем изменение input
                const dataTransfer = new DataTransfer();
                Array.from(files).forEach(file => dataTransfer.items.add(file));
                fileUpload.files = dataTransfer.files;
                
                // Вызываем обработчик изменения
                const changeEvent = new Event('change');
                fileUpload.dispatchEvent(changeEvent);
            }
            
            // Анимация при наведении
            fileUpload.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                
                // Добавляем пульсацию границы
                let counter = 0;
                const borderPulse = setInterval(() => {
                    if (counter >= 2 || !this.matches(':hover')) {
                        clearInterval(borderPulse);
                        this.style.borderColor = '';
                        return;
                    }
                    
                    this.style.borderColor = 'var(--primary-color)';
                    setTimeout(() => {
                        if (this.matches(':hover')) {
                            this.style.borderColor = 'rgba(var(--primary-rgb), 0.3)';
                        }
                    }, 300);
                    
                    counter++;
                }, 600);
            });
            
            // Анимация при покидании элемента
            fileUpload.addEventListener('mouseleave', function() {
                this.style.transition = 'all 0.3s ease';
            });
            
            // При изменении (выборе файла)
            fileUpload.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const fileCount = this.files.length;
                    const fileInfo = this.parentNode.querySelector('.file-upload-info');
                    
                    if (fileInfo) {
                        // Оригинальный текст с информацией
                        const originalText = fileInfo.innerText;
                        
                        // Собираем все существующие файлы
                        const selectedFiles = new DataTransfer();
                        
                        // Если есть уже выбранные файлы (при повторном выборе), добавляем их
                        if (this._selectedFiles) {
                            Array.from(this._selectedFiles.files).forEach(file => {
                                selectedFiles.items.add(file);
                            });
                        }
                        
                        // Добавляем новые файлы
                        Array.from(this.files).forEach(file => {
                            selectedFiles.items.add(file);
                        });
                        
                        // Сохраняем выбранные файлы
                        this._selectedFiles = selectedFiles;
                        
                        // Изменяем стиль загрузчика для индикации успешного выбора
                        fileUploadLabel.style.borderColor = 'var(--success-color)';
                        fileUploadLabel.style.backgroundColor = 'rgba(var(--success-rgb), 0.05)';
                        
                        // Отображаем превью выбранных файлов
                        const selectedFilesContainer = document.getElementById('selected-files');
                        selectedFilesContainer.innerHTML = '';
                        
                        // Для каждого файла создаем элемент превью
                        Array.from(selectedFiles.files).forEach(file => {
                            // Определяем иконку в зависимости от типа файла
                            let iconClass = 'fa-file';
                            const fileExt = file.name.split('.').pop().toLowerCase();
                            
                            if (['pdf'].includes(fileExt)) {
                                iconClass = 'fa-file-pdf';
                            } else if (['doc', 'docx'].includes(fileExt)) {
                                iconClass = 'fa-file-word';
                            } else if (['xls', 'xlsx'].includes(fileExt)) {
                                iconClass = 'fa-file-excel';
                            } else if (['ppt', 'pptx'].includes(fileExt)) {
                                iconClass = 'fa-file-powerpoint';
                            }
                            
                            // Форматируем размер файла
                            const fileSize = file.size < 1024 * 1024 
                                ? `${(file.size / 1024).toFixed(1)} KB` 
                                : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
                            
                            // Создаем элемент превью файла
                            const filePreview = document.createElement('div');
                            filePreview.className = 'file-preview';
                            filePreview.innerHTML = `
                                <div class="file-icon">
                                    <i class="fas ${iconClass}"></i>
                                </div>
                                <div class="file-info">
                                    <div class="file-name">${file.name}</div>
                                    <div class="file-size">${fileSize}</div>
                                </div>
                                <div class="file-remove" data-filename="${file.name}">
                                    <i class="fas fa-times"></i>
                                </div>
                            `;
                            
                            selectedFilesContainer.appendChild(filePreview);
                        });
                        
                        // Обновляем информационную строку
                        const fileCountText = selectedFiles.files.length === 1 
                            ? '1 файл выбран' 
                            : `<span class="selected-files-count">${selectedFiles.files.length}</span> файлов выбрано`;
                            
                        fileInfo.innerHTML = `
                            <i class="fas fa-check-circle text-success me-1"></i>
                            ${fileCountText} 
                            <span class="ms-1 text-muted">(${originalText.split('(')[1] || 'макс. размер 10MB)'})</span>
                        `;
                        
                        // Обновляем файлы в input
                        this.files = selectedFiles.files;
                        
                        // Добавляем обработчики для кнопок удаления файлов
                        document.querySelectorAll('.file-remove').forEach(button => {
                            button.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                // Находим имя файла, который нужно удалить
                                const filename = this.getAttribute('data-filename');
                                
                                // Удаляем файл из списка
                                const newFiles = new DataTransfer();
                                
                                Array.from(fileUpload._selectedFiles.files).forEach(file => {
                                    if (file.name !== filename) {
                                        newFiles.items.add(file);
                                    }
                                });
                                
                                // Обновляем выбранные файлы
                                fileUpload._selectedFiles = newFiles;
                                fileUpload.files = newFiles.files;
                                
                                // Удаляем элемент превью с анимацией
                                const preview = this.closest('.file-preview');
                                preview.style.opacity = '0';
                                preview.style.transform = 'translateX(20px)';
                                
                                setTimeout(() => {
                                    preview.remove();
                                    
                                    // Проверяем, сколько файлов осталось
                                    const remainingPreviews = document.querySelectorAll('.file-preview').length;
                                    
                                    // Если не осталось файлов, возвращаем оригинальный текст и стиль
                                    if (remainingPreviews === 0) {
                                        fileInfo.innerHTML = `<i class="fas fa-info-circle me-1"></i>
                                        Допустимые форматы: PDF, Word, Excel, PowerPoint (макс. размер 10MB)`;
                                        fileUploadLabel.style.borderColor = '';
                                        fileUploadLabel.style.backgroundColor = '';
                                        
                                        // Очищаем input
                                        fileUpload.value = '';
                                        fileUpload._selectedFiles = null;
                                    } else {
                                        // Обновляем текст с количеством оставшихся файлов
                                        const fileCountText = remainingPreviews === 1 
                                            ? '1 файл выбран' 
                                            : `<span class="selected-files-count">${remainingPreviews}</span> файлов выбрано`;
                                            
                                        fileInfo.innerHTML = `
                                            <i class="fas fa-check-circle text-success me-1"></i>
                                            ${fileCountText} 
                                            <span class="ms-1 text-muted">(макс. размер 10MB)</span>
                                        `;
                                    }
                                }, 300);
                            });
                        });
                    }
                }
            });
        }
        
        contactForm.addEventListener('submit', function(event) {
            // Проверка email
            const email = document.getElementById('email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Проверка телефона (если поле существует)
            const phone = document.getElementById('phone');
            let hasPhoneError = false;
            
            if (phone && phone.value) {
            const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
                hasPhoneError = !phoneRegex.test(phone.value);
            }
            
            let hasError = false;
            
            // Проверка email
            if (!emailRegex.test(email)) {
                event.preventDefault();
                hasError = true;
                
                // Создаем сообщение об ошибке для email
                const existingEmailError = document.querySelector('.email-error');
                if (!existingEmailError) {
                    showFieldError('email', 'Пожалуйста, введите корректный email-адрес');
                }
            }
            
            // Проверка телефона (если поле существует)
            if (phone && hasPhoneError) {
                event.preventDefault();
                hasError = true;
                
                // Создаем сообщение об ошибке для телефона
                const existingPhoneError = document.querySelector('.phone-error');
                if (!existingPhoneError) {
                    showFieldError('phone', 'Пожалуйста, введите корректный номер телефона');
                }
            }
            
            // Если есть ошибки, прокручиваем к первой ошибке
            if (hasError) {
                const firstError = document.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                // Анимация отправки формы
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Отправка...';
                    submitBtn.disabled = true;
                }
            }
        });
        
        // Очистка сообщений об ошибках при вводе
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
                const errorDiv = this.parentNode.querySelector('.flash-message.error');
                if (errorDiv) {
                    errorDiv.remove();
                }
            });
            
            // Эффект фокуса
            input.addEventListener('focus', function() {
                const label = this.parentNode.querySelector('.form-label');
                if (label) {
                    label.style.color = 'var(--primary-color)';
                }
            });
            
            input.addEventListener('blur', function() {
                const label = this.parentNode.querySelector('.form-label');
                if (label) {
                    label.style.color = '';
                }
            });
        });
    }

// Функция для отображения ошибки поля
function showFieldError(fieldId, errorMessage) {
    const errorDiv = document.createElement('div');
    errorDiv.className = `flash-message error mt-2 ${fieldId}-error`;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i> ${errorMessage}`;
    
    const field = document.getElementById(fieldId).parentNode;
    field.appendChild(errorDiv);
    
    // Анимация встряхивания поля с ошибкой
    const input = document.getElementById(fieldId);
    input.classList.add('is-invalid');
    input.style.animation = 'shake 0.5s';
    
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

// Анимации и стили
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
        40% {transform: translateY(-10px);}
        60% {transform: translateY(-5px);}
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .is-invalid {
        border-color: var(--danger-color) !important;
    }
    
    /* Улучшенные эффекты для формы */
    .contact-form .form-control {
        transition: all 0.3s ease;
    }
    
    .contact-form .form-control:focus {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(var(--primary-rgb), 0.15);
    }
    
    /* Улучшенная анимация для файлового инпута */
    .file-upload {
        position: relative;
        z-index: 1;
        overflow: hidden;
    }
    
    .file-upload::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.4) 50%, 
            rgba(255, 255, 255, 0) 100%);
        transform: skewX(-25deg);
        transition: all 0.7s ease;
        opacity: 0;
        z-index: 0;
    }
    
    /* Стили для отображения выбранных файлов */
    .selected-files-container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    
    .file-preview {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.08);
        margin-bottom: 10px;
        border: 1px solid rgba(var(--primary-rgb), 0.1);
        transition: all 0.3s ease;
        animation: fadeIn 0.5s;
        position: relative;
    }
    
    .file-preview:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(var(--primary-rgb), 0.15);
        border-color: rgba(var(--primary-rgb), 0.2);
    }
    
    .file-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        border-radius: 8px;
        background-color: rgba(var(--primary-rgb), 0.1);
        color: var(--primary-color);
        font-size: 18px;
        flex-shrink: 0;
    }
    
    .file-info {
        flex: 1;
        min-width: 0; /* Необходимо для правильной работы text-overflow */
    }
    
    .file-name {
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 3px;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .file-size {
        font-size: 0.75rem;
        color: var(--text-secondary);
    }
    
    .file-remove {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background-color: rgba(var(--danger-rgb), 0.08);
        color: var(--danger-color);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-left: 15px;
        flex-shrink: 0;
    }
    
    .file-remove:hover {
        background-color: var(--danger-color);
        color: white;
        transform: scale(1.1);
    }
    
    .dark-theme .file-preview {
        background-color: rgba(var(--background-secondary-rgb), 0.6);
        border-color: rgba(var(--primary-rgb), 0.2);
    }
    
    .dark-theme .file-name {
        color: rgba(255,255,255,0.9);
    }
    
    .dark-theme .file-size {
        color: rgba(255,255,255,0.6);
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .selected-files-count {
        font-weight: 500;
        color: var(--success-color);
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(styleSheet);

// Обработка прокрутки для анимации появления элементов
window.addEventListener('scroll', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementPosition < windowHeight - 100) {
            element.classList.add('active');
        }
        });
    });
    
    // Добавляем анимацию к контактной информации
    const contactInfoItems = document.querySelectorAll('.contact-info-item');
    contactInfoItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 300 + (index * 150));
    });
});
