/**
 * Main JavaScript file for EchoTech website
 * Handles common functionality across the site
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Handle header scroll effect
    handleHeaderScroll();
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize popovers
    initPopovers();
    
    // Fix modal backdrop issues
    fixModalBackdropIssues();
    
    // Initialize hero section background circles
    initHeroBackgroundCircles();
    
    // Также вызовем после небольшой задержки, чтобы гарантировать инициализацию
    setTimeout(() => {
        fixModalBackdropIssues();
    }, 500);
});

/**
 * Initialize background circles for hero section
 */
function initHeroBackgroundCircles() {
    const circlesContainer = document.querySelector('.circles-background');
    if (!circlesContainer) return;
    
    // Get current theme
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Get computed style variables
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColorRGB = computedStyle.getPropertyValue('--primary-rgb').trim().split(',');
    
    // Generate array of unique animation paths
    const chaoticPaths = [];
    for (let i = 0; i < 10; i++) {
        // Create a unique animation name for each path
        const animName = `float-chaotic-${i + 1}`;
        
        // Generate random keyframe points
        const keyframes = `
            @keyframes ${animName} {
                0% { transform: translateY(0) translateX(0); }
                20% { transform: translateY(${-25 + Math.random() * 50}px) translateX(${-25 + Math.random() * 50}px); }
                40% { transform: translateY(${-25 + Math.random() * 50}px) translateX(${-25 + Math.random() * 50}px); }
                60% { transform: translateY(${-25 + Math.random() * 50}px) translateX(${-25 + Math.random() * 50}px); }
                80% { transform: translateY(${-25 + Math.random() * 50}px) translateX(${-25 + Math.random() * 50}px); }
                100% { transform: translateY(0) translateX(0); }
            }
        `;
        
        // Add keyframes to document
        const styleElement = document.createElement('style');
        styleElement.textContent = keyframes;
        document.head.appendChild(styleElement);
        
        // Add to paths array
        chaoticPaths.push(animName);
    }
    
    // Create circles
    const circlesCount = 20; // Increase number for more chaotic effect
    for (let i = 0; i < circlesCount; i++) {
        const circle = document.createElement('div');
        circle.className = 'background-circle';
        
        // Random position
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        
        // Random size (larger)
        const size = 40 + Math.random() * 140;
        
        // Random opacity (very subtle)
        const opacity = 0.05 + Math.random() * 0.1;
        
        // Choose random animation path
        const animationName = chaoticPaths[Math.floor(Math.random() * chaoticPaths.length)];
        
        // Random duration and delay
        const duration = 10 + Math.random() * 20; // Between 10s and 30s
        const delay = Math.random() * 10; // Up to 10s delay
        
        // Set circle styles
        circle.style.position = 'absolute';
        circle.style.top = `${top}%`;
        circle.style.left = `${left}%`;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.borderRadius = '50%';
        circle.style.background = `rgba(${primaryColorRGB[0]}, ${primaryColorRGB[1]}, ${primaryColorRGB[2]}, ${opacity})`;
        circle.style.animation = `${animationName} ${duration}s ease-in-out infinite`;
        circle.style.animationDelay = `${delay}s`;
        circle.style.animationDirection = Math.random() > 0.5 ? 'alternate' : 'normal';
        
        // Add to container
        circlesContainer.appendChild(circle);
    }
    
    // Update circles when theme changes
    document.addEventListener('theme-changed', () => {
        // Get updated color variables after theme change
        const newComputedStyle = getComputedStyle(document.documentElement);
        const newPrimaryColorRGB = newComputedStyle.getPropertyValue('--primary-rgb').trim().split(',');
        
        // Update all circles with new colors
        const circles = circlesContainer.querySelectorAll('.background-circle');
        circles.forEach(circle => {
            const opacity = parseFloat(circle.style.background.split(',')[3]) || 0.1;
            circle.style.background = `rgba(${newPrimaryColorRGB[0]}, ${newPrimaryColorRGB[1]}, ${newPrimaryColorRGB[2]}, ${opacity})`;
        });
    });
}

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
    // Get all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each element
    animatedElements.forEach(element => {
        // Initially hide the element
        element.style.opacity = '0';
        observer.observe(element);
    });
    
    // Add CSS for the animations
    const style = document.createElement('style');
    style.textContent = `
        .fade-in.animated {
            animation: fadeIn 1s ease forwards;
        }
        .slide-up.animated {
            animation: slideUp 0.8s ease forwards;
        }
        .slide-in-left.animated {
            animation: slideInLeft 0.8s ease forwards;
        }
        .slide-in-right.animated {
            animation: slideInRight 0.8s ease forwards;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Handle header scroll effect
 */
function handleHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Initialize Bootstrap tooltips
 */
function initTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltipTriggerList.length > 0) {
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
}

/**
 * Initialize Bootstrap popovers
 */
function initPopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    if (popoverTriggerList.length > 0) {
        [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    }
}

/**
 * Smooth scroll to element
 * @param {string} elementId - The ID of the element to scroll to
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
    });
}

/**
 * Format number with commas for thousands
 * @param {number} number - The number to format
 * @returns {string} The formatted number
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Get random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number between min and max
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get random color
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} Random RGBA color
 */
function getRandomColor(opacity = 1) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds
 * @returns {Function} The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Fix issues with modal backdrops and z-indexes, particularly related to theme switching
 */
function fixModalBackdropIssues() {
    // Вернемся к стандартному подходу Bootstrap, но с необходимыми исправлениями
    
    // 1. Добавим CSS, гарантирующий корректное отображение модальных окон
    const modalFixStyle = document.createElement('style');
    modalFixStyle.textContent = `
        .modal {
            z-index: 1055 !important;
        }
        .modal-backdrop {
            z-index: 1050 !important;
        }
        .modal-dialog {
            z-index: 1056 !important;
            max-width: 800px;
            margin: 30px auto;
        }
        .modal-content {
            border-radius: 0.5rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            border: none;
        }
        .modal-header .btn-close {
            z-index: 1060;
            position: relative;
            padding: 0.5rem;
            opacity: 0.75;
        }
        .modal-header .btn-close:hover {
            opacity: 1;
        }
        
        /* Фикс для предотвращения провала контента под модальное окно */
        body.modal-open {
            padding-right: 0 !important;
            overflow: hidden;
        }
        
        /* Гарантия видимости контента */
        .modal.show .modal-dialog {
            transform: translate(0, 0);
        }
    `;
    document.head.appendChild(modalFixStyle);
    
    // 2. Восстановим исходное состояние модальных окон при загрузке страницы
    function resetModalState() {
        // Очистка предыдущих бэкдропов
        const extraBackdrops = document.querySelectorAll('.modal-backdrop');
        extraBackdrops.forEach(backdrop => backdrop.remove());
        
        // Сброс состояния body
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Очистка всех открытых модальных окон
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
        
        // Очистка блокеров темы
        clearThemeBlockers();
    }
    
    // 3. Инициализация модальных окон через Bootstrap
    function initBootstrapModals() {
        // Находим все модальные окна на странице
        const modals = document.querySelectorAll('.modal');
        
        // Инициализируем каждое модальное окно через Bootstrap
        if (typeof bootstrap !== 'undefined') {
            modals.forEach(modal => {
                // Используем стандартную инициализацию Bootstrap
                new bootstrap.Modal(modal);
                
                // Исправляем вёрстку модального окна для темы
                fixModalForCurrentTheme(modal);
                
                // Обработчик события закрытия модального окна
                modal.addEventListener('hidden.bs.modal', function() {
                    // Удаляем лишние backdrops, если они есть
                    const extraBackdrops = document.querySelectorAll('.modal-backdrop:not(:first-child)');
                    extraBackdrops.forEach(backdrop => backdrop.remove());
                    
                    // Проверка, не осталось ли открытых модальных окон
                    const openModals = document.querySelectorAll('.modal.show');
                    if (openModals.length === 0) {
                        // Сбрасываем класс modal-open с body
                        document.body.classList.remove('modal-open');
                        document.body.style.overflow = '';
                        document.body.style.paddingRight = '';
                    }
                });
            });
        }
    }
    
    // 4. Исправляем тему для модального окна
    function fixModalForCurrentTheme(modal) {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        
        // Применяем стили для темной темы в модальном окне
        if (theme === 'dark') {
            const bgLightElements = modal.querySelectorAll('.bg-light');
            bgLightElements.forEach(el => {
                el.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                el.style.color = 'var(--text-primary)';
            });
        } else {
            const bgLightElements = modal.querySelectorAll('.bg-light');
            bgLightElements.forEach(el => {
                el.style.backgroundColor = '';
                el.style.color = '';
            });
        }
    }
    
    // 5. Добавляем обработчики нажатий на кнопки модальных окон
    function setModalButtonHandlers() {
        // Получаем все кнопки, открывающие модальные окна
        const modalButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
        
        // Добавляем обработчик нажатия на кнопки
        modalButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                // Находим целевой ID модального окна
                const targetId = button.getAttribute('data-bs-target') || button.getAttribute('href');
                
                if (!targetId) return;
                
                // Находим модальное окно
                const modal = document.querySelector(targetId);
                
                if (!modal) return;
                
                // Очищаем любые блокеры темы перед открытием
                clearThemeBlockers();
                
                // Исправляем тему для этого модального окна
                setTimeout(() => {
                    fixModalForCurrentTheme(modal);
                }, 10);
            });
        });
    }
    
    // Сначала сбрасываем состояние всех модальных окон
    resetModalState();
    
    // Инициализируем модальные окна
    initBootstrapModals();
    
    // Устанавливаем обработчики кнопок
    setModalButtonHandlers();
    
    // Обработчик переключения темы для открытых модальных окон
    document.addEventListener('theme-changed', function(e) {
        setTimeout(() => {
            // Исправляем стили для всех модальных окон
            document.querySelectorAll('.modal').forEach(modal => {
                fixModalForCurrentTheme(modal);
            });
        }, 100);
    });
    
    // Публичная функция для сброса состояния всех модальных окон
    window.resetAllModals = resetModalState;
    
    // Публичная функция для фиксирования темы в модальных окнах
    window.fixAllModalThemes = function() {
        document.querySelectorAll('.modal').forEach(modal => {
            fixModalForCurrentTheme(modal);
        });
    };
    
    // Повторная инициализация и после полной загрузки страницы
    window.addEventListener('load', function() {
        setTimeout(() => {
            initBootstrapModals();
            setModalButtonHandlers();
        }, 300);
    });
}

/**
 * Очистка всех потенциальных блокеров темы
 */
function clearThemeBlockers() {
    const themeBlocker = document.getElementById('theme-transition-blocker');
    if (themeBlocker) {
        themeBlocker.remove();
    }
    
    // Также проверим другие потенциальные блокеры
    document.querySelectorAll('.theme-transition-overlay, .theme-transition-ripple').forEach(element => {
        element.remove();
    });
}

// Экспортируем функцию очистки блокеров глобально
window.clearThemeBlockers = clearThemeBlockers;

/**
 * Исправление всех модальных окон на странице
 */
function fixAllModals() {
    // Исправляем все модальные окна и их кнопки закрытия
    document.querySelectorAll('.modal').forEach(modal => {
        // Исправляем слои modal-dialog и modal-content
        const modalDialog = modal.querySelector('.modal-dialog');
        if (modalDialog) {
            modalDialog.style.pointerEvents = 'all';
            modalDialog.style.zIndex = '1050';
        }
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.pointerEvents = 'all';
            modalContent.style.zIndex = '1050';
        }
        
        // Исправляем кнопку закрытия
        const closeButton = modal.querySelector('.btn-close');
        if (closeButton) {
            closeButton.style.zIndex = '1060';
            closeButton.style.position = 'relative';
            closeButton.style.pointerEvents = 'all';
        }
        
        // Проверяем тему
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const bgLightElements = modal.querySelectorAll('.bg-light');
        
        if (theme === 'dark' && bgLightElements.length > 0) {
            bgLightElements.forEach(el => {
                el.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                el.style.color = 'var(--text-primary)';
            });
        }
    });
}

// Экспортируем функцию исправления модальных окон глобально
window.fixAllModals = fixAllModals;

/**
 * Радикальное решение проблемы с квадратными кнопками в Chrome при нажатии
 */
document.addEventListener('DOMContentLoaded', function() {
    // Определяем используемый браузер
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isChrome) {
        // Добавляем класс к body для специфичных CSS-стилей
        document.body.classList.add('chrome-browser');
        
        // Находим все кнопки
        const allButtons = document.querySelectorAll('.btn');
        
        allButtons.forEach(button => {
            // Создаем специальную обертку для сохранения формы кнопки
            // Эта обертка заменит стандартное поведение кнопки
            const buttonRoundedClone = document.createElement('div');
            buttonRoundedClone.className = 'button-rounded-clone';
            
            // Копируем исходные стили кнопки
            const computedStyle = window.getComputedStyle(button);
            buttonRoundedClone.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: ${computedStyle.borderRadius || '8px'};
                pointer-events: none;
                z-index: 2;
                background: transparent;
                border: 2px solid rgba(82, 113, 232, 0);
                transition: border-color 0.2s ease;
            `;
            
            // Делаем кнопку относительно позиционированной, если она еще не такая
            if (computedStyle.position === 'static') {
                button.style.position = 'relative';
            }
            
            // Добавляем невидимую обертку внутрь кнопки
            if (!button.querySelector('.button-rounded-clone')) {
                button.appendChild(buttonRoundedClone);
            }
            
            // Перехватываем нажатие на кнопку
            button.addEventListener('mousedown', function(e) {
                // Активируем видимость обертки
                const cloneElement = this.querySelector('.button-rounded-clone');
                if (cloneElement) {
                    cloneElement.style.borderColor = 'rgba(82, 113, 232, 0.4)';
                }
                
                // Добавляем класс для CSS-стилей
                this.classList.add('btn-clicked');
                
                // Программно устанавливаем скругленные углы
                this.style.borderRadius = '8px';
                this.style.webkitBorderRadius = '8px';
                
                // Используем SVG-маску для поддержания скругления
                if (this.tagName === 'A') {
                    this.style.maskImage = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'><rect x=\'0\' y=\'0\' width=\'100\' height=\'100\' rx=\'8\' ry=\'8\'/></svg>")';
                    this.style.webkitMaskImage = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'><rect x=\'0\' y=\'0\' width=\'100\' height=\'100\' rx=\'8\' ry=\'8\'/></svg>")';
                    this.style.maskSize = '100% 100%';
                    this.style.webkitMaskSize = '100% 100%';
                }
            });
            
            // Обработка клика по ссылке-кнопке
            if (button.tagName === 'A' && button.getAttribute('href')) {
                button.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    // Обрабатываем только внешние ссылки 
                    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                        e.preventDefault();
                        
                        // Создаем невидимый клон кнопки для сохранения стилей
                        const buttonClone = this.cloneNode(true);
                        buttonClone.style.position = 'fixed';
                        buttonClone.style.opacity = '0';
                        buttonClone.style.zIndex = '-1';
                        buttonClone.style.pointerEvents = 'none';
                        document.body.appendChild(buttonClone);
                        
                        // Задержка перед переходом для визуального отображения нажатия
                        setTimeout(() => {
                            window.location.href = href;
                            
                            // Очищаем клон, если переход не произошел
                            setTimeout(() => {
                                if (document.body.contains(buttonClone)) {
                                    document.body.removeChild(buttonClone);
                                }
                            }, 500);
                        }, 150);
                    }
                });
            }
            
            // Обработчики для восстановления стиля кнопки
            ['mouseup', 'mouseleave', 'touchend'].forEach(eventType => {
                button.addEventListener(eventType, function() {
                    // Скрываем обертку
                    const cloneElement = this.querySelector('.button-rounded-clone');
                    if (cloneElement) {
                        cloneElement.style.borderColor = 'rgba(82, 113, 232, 0)';
                    }
                    
                    // Удаляем класс
                    this.classList.remove('btn-clicked');
                    
                    // Очищаем временные стили через небольшую задержку
                    setTimeout(() => {
                        this.style.borderRadius = '';
                        this.style.webkitBorderRadius = '';
                        this.style.maskImage = '';
                        this.style.webkitMaskImage = '';
                        this.style.maskSize = '';
                        this.style.webkitMaskSize = '';
                    }, 50);
                });
            });
        });
        
        // Обработчик перед уходом со страницы - сохраняем стили кнопок
        window.addEventListener('beforeunload', function() {
            const clickedButtons = document.querySelectorAll('.btn:active, .btn.btn-clicked');
            clickedButtons.forEach(button => {
                button.classList.add('btn-navigating');
                button.style.borderRadius = '8px';
                button.style.webkitBorderRadius = '8px';
            });
        });
    }
    
    // Добавляем обработку для Safari
    if (isSafari) {
        // Добавляем класс к body для Safari-специфичных стилей
        document.body.classList.add('safari-browser');
        
        // Перемещаем логику в CSS с помощью медиа-запросов (@media) 
        // для более надежной работы в Safari
    }
});
