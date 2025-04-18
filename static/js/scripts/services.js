document.addEventListener('DOMContentLoaded', function() {
    // Функции для полноэкранных модальных окон
    window.openServiceModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Показываем модальное окно
            modal.style.display = 'block';

            // Анимация появления
            setTimeout(() => {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';

                // Анимация контента
                const content = modal.querySelector('.custom-modal-content');
                if (content) {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }
            }, 10);
        }
    };

    window.closeServiceModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Анимация закрытия
            const content = modal.querySelector('.custom-modal-content');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
            }

            // Удаляем класс show
            modal.classList.remove('show');

            // Ждем окончания анимации перед скрытием
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    };

    // Закрытие модального окна при клике на оверлей
    const modalOverlays = document.querySelectorAll('.custom-modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const modal = this.closest('.custom-modal');
            if (modal) {
                closeServiceModal(modal.id);
            }
        });
    });

    // Обработчик для клавиши Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.custom-modal.show');
            openModals.forEach(modal => {
                closeServiceModal(modal.id);
            });
        }
    });

    // Инициализация визуализаций
    /* Начало цикла Jinja */
    /* {% for service in services %} */
    try {
        if (typeof initServiceVisualization === 'function') {
            initServiceVisualization('{{ service.id }}-visual', '{{ service.id }}');
        } else {
            console.log('Функция визуализации еще не загружена');
            const visualContainer = document.getElementById('{{ service.id }}-visual');
            if (visualContainer) {
                visualContainer.style.display = 'flex';
                visualContainer.style.alignItems = 'center';
                visualContainer.style.justifyContent = 'center';
                visualContainer.innerHTML = '<div style="text-align: center;"><i class="fas {{ service.icon }} fa-3x mb-3" style="color: var(--primary-color);"></i><p>{{ service.name }}</p></div>';
            }
        }
    } catch (error) {
        console.log('Функция визуализации еще не загружена');
    }
    /* {% endfor %} */
    /* Конец цикла Jinja */

    // Работа с боковой панелью категорий
    const categoriesToggle = document.querySelector('.categories-toggle');
    const categoriesPanel = document.querySelector('.service-categories');

    if (categoriesToggle && categoriesPanel) {
        categoriesToggle.addEventListener('click', function() {
            categoriesPanel.classList.toggle('expanded');

            // Изменение иконки
            const icon = this.querySelector('i');
            if (categoriesPanel.classList.contains('expanded')) {
                icon.classList.remove('fa-chevron-left');
                icon.classList.add('fa-chevron-right');
            } else {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-left');
            }
        });
    }

    // Плавная прокрутка и активные ссылки
    const categoryLinks = document.querySelectorAll('.categories-list a');
    const sections = document.querySelectorAll('.service-card, #tech-services, #client-solutions');

    // Наблюдатель пересечений для отслеживания видимых секций
    if ('IntersectionObserver' in window) {
        const options = {
            root: null,
            rootMargin: '-100px 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    setActiveLink(id);
                }
            });
        }, options);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    function setActiveLink(id) {
        categoryLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === id) {
                link.classList.add('active');
            }
        });
    }

    // Обработчик клика для плавной прокрутки
    categoryLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Рассчитываем позицию с учетом шапки сайта
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    // Плавно прокручиваем к элементу
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Подсвечиваем элемент при прокрутке к нему
                    targetElement.classList.add('highlight-animation');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight-animation');
                    }, 1000);

                    // Устанавливаем активную ссылку
                    categoryLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');

                    // На мобильных устройствах скрываем панель после выбора
                    if (window.innerWidth <= 991) {
                        categoriesPanel.classList.remove('expanded');
                        const icon = categoriesToggle.querySelector('i');
                        icon.classList.remove('fa-chevron-right');
                        icon.classList.add('fa-chevron-left');
                    }
                }
            });
        }
    });

    // Анимации для карточек услуг при скролле
    const animateOnScroll = function() {
        const serviceCards = document.querySelectorAll('.service-card, .service-segment, .service-feature-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('show-card');
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        serviceCards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    };

    // Инициализируем анимации
    animateOnScroll();

    // Добавляем анимацию для историй успеха и бизнес-кейсов
    const storyCards = document.querySelectorAll('.result-card');
    storyCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 100 * index);
        }, 500);
    });
    
    // Улучшенная анимация для элементов "Что вы получите" и "Влияние на бизнес"
    const enhanceResultItems = () => {
        const resultItems = document.querySelectorAll('.result-items .result-item');
        
        // Добавляем начальные стили для анимации появления
        resultItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px) translateY(10px)';
            item.style.transition = 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1), transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            
            // Последовательное появление элементов
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0) translateY(0)';
            }, 180 * index + 400);
            
            // Добавляем обработчик событий для улучшенного hover-эффекта
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.3) rotate(15deg)';
                    icon.style.backgroundColor = 'rgba(var(--primary-rgb), 0.2)';
                    icon.style.boxShadow = '0 4px 8px rgba(var(--primary-rgb), 0.2), 0 0 0 2px rgba(var(--primary-rgb), 0.1)';
                    icon.style.color = 'var(--primary-color)';
                }
                
                // Добавляем блики на элемент
                addShine(this);
            });
            
            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = '';
                    icon.style.backgroundColor = '';
                    icon.style.boxShadow = '';
                    icon.style.color = '';
                }
                
                // Удаляем блики
                removeShine(this);
            });
        });
        
        // Добавляем эффект пульсации для иконок при прокрутке к разделу
        const resultSections = document.querySelectorAll('.short-section');
        
        const pulseObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    
                    // Добавляем эффект рисования контуров для заголовка
                    const title = section.querySelector('h5');
                    if (title) {
                        title.classList.add('draw-border-effect');
                        setTimeout(() => {
                            title.classList.remove('draw-border-effect');
                        }, 1500);
                    }
                    
                    // Анимация для иконок
                    const icons = section.querySelectorAll('.result-item i');
                    icons.forEach((icon, idx) => {
                        setTimeout(() => {
                            icon.classList.add('pulse-effect');
                            icon.style.transform = 'scale(1.3) rotate(15deg)';
                            icon.style.backgroundColor = 'rgba(var(--primary-rgb), 0.2)';
                            
                            setTimeout(() => {
                                icon.classList.remove('pulse-effect');
                                icon.style.transform = '';
                                icon.style.backgroundColor = '';
                            }, 800);
                        }, 180 * idx);
                    });
                    
                    // Анимируем появление элементов в разделе
                    const items = section.querySelectorAll('.result-item');
                    items.forEach((item, idx) => {
                        setTimeout(() => {
                            item.classList.add('highlight-item');
                            setTimeout(() => {
                                item.classList.remove('highlight-item');
                            }, 800);
                        }, 180 * idx + 200);
                    });
                }
            });
        }, {
            threshold: 0.7,
            rootMargin: '0px 0px -10% 0px'
        });
        
        resultSections.forEach(section => {
            pulseObserver.observe(section);
        });
        
        // Добавляем плавающие частицы на фон для карточек
        const serviceCards = document.querySelectorAll('.service-segment-card');
        serviceCards.forEach(card => {
            addFloatingParticles(card);
        });
    };
    
    // Функция для добавления блика при наведении
    const addShine = (element) => {
        // Создаем эффект блика
        const shine = document.createElement('div');
        shine.classList.add('shine-effect');
        element.appendChild(shine);
        
        // Запускаем анимацию через небольшую задержку
        setTimeout(() => {
            shine.style.opacity = '1';
            shine.style.transform = 'translateX(100%) rotate(30deg)';
        }, 10);
        
        // Удаляем блик после завершения анимации
        setTimeout(() => {
            if (element.contains(shine)) {
                element.removeChild(shine);
            }
        }, 600);
    };
    
    // Функция для удаления блика
    const removeShine = (element) => {
        const shine = element.querySelector('.shine-effect');
        if (shine) {
            element.removeChild(shine);
        }
    };
    
    // Функция для добавления плавающих частиц
    const addFloatingParticles = (container) => {
        // Добавляем контейнер для частиц
        const particlesContainer = document.createElement('div');
        particlesContainer.classList.add('particles-container');
        container.appendChild(particlesContainer);
        
        // Количество частиц
        const particlesCount = 5;
        
        // Создаем частицы
        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('floating-particle');
            
            // Задаем случайные свойства
            const size = Math.random() * 10 + 5;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            particlesContainer.appendChild(particle);
        }
    };
    
    // Создаем стили для анимации линий
    const addLineAnimationStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Отключаем анимацию линий */
            .section-title::after,
            .result-title::after,
            .advantages-title::after {
                display: none;
            }
            
            /* Сохраняем анимацию боковых линий карточек */
            .service-segment-card::before,
            .service-segment-card::after {
                height: 0;
                transition: height 0s;
            }
            
            .animate-card-borders::before {
                animation: border-line-appear 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
            }
            
            .animate-card-borders::after {
                animation: border-line-appear 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s forwards;
            }
            
            @keyframes border-line-appear {
                0% { height: 0; }
                100% { height: 30%; }
            }
            
            /* Анимация левой линии для элементов */
            .result-item:hover::before, 
            .advantage-item:hover::before {
                animation: grow-line 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            }
            
            @keyframes grow-line {
                0% { height: 0; }
                100% { height: 100%; }
            }
        `;
        document.head.appendChild(style);
    };
    
    // Инициализируем анимацию линий
    addLineAnimationStyles();
    enhanceResultItems();
});