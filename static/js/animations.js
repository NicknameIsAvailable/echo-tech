/**
 * Initialize hero section circles animation (similar to contact page)
 * @param {string} canvasId - The ID of the canvas element
 */
function initHeroAnimation(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Get current theme
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';

    // Get computed style variables
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColorRGB = computedStyle.getPropertyValue('--primary-rgb').trim().split(',');
    
    // Replace the Three.js animation with static circles
    const heroSection = canvas.closest('.hero-section');
    if (heroSection) {
        // Remove the canvas and its container
        const canvasContainer = heroSection.querySelector('.hero-canvas-blur-container');
        if (canvasContainer) {
            canvasContainer.remove();
        }
        
        // Create simple circles background
        const circlesContainer = document.createElement('div');
        circlesContainer.className = 'circles-background';
        
        // Add the circles container before the hero content
        const heroContent = heroSection.querySelector('.hero-content');
        heroSection.insertBefore(circlesContainer, heroContent);
        
        // Add gradient background to hero section
        heroSection.style.background = `linear-gradient(135deg, 
            rgba(var(--background-primary-rgb), 0.8) 0%, 
            rgba(var(--background-secondary-rgb), 0.9) 100%)`;
            
        // Create circles
        const circlesCount = 15; // Fewer, larger circles
        for (let i = 0; i < circlesCount; i++) {
            const circle = document.createElement('div');
            circle.className = 'background-circle';
            
            // Random position
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            
            // Random size (larger)
            const size = 50 + Math.random() * 150;
            
            // Random opacity (very subtle)
            const opacity = 0.05 + Math.random() * 0.1;
            
            // Set circle styles
            circle.style.position = 'absolute';
            circle.style.top = `${top}%`;
            circle.style.left = `${left}%`;
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.borderRadius = '50%';
            circle.style.background = `rgba(${primaryColorRGB[0]}, ${primaryColorRGB[1]}, ${primaryColorRGB[2]}, ${opacity})`;
            circle.style.animation = `float ${5 + Math.random() * 10}s ease-in-out infinite`;
            circle.style.animationDelay = `${Math.random() * 5}s`;
            
            // Add to container
            circlesContainer.appendChild(circle);
        }
        
        // Add CSS for animation
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .circles-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: 0;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0) translateX(0); }
                50% { transform: translateY(-20px) translateX(10px); }
            }
            
            .hero-section {
                position: relative;
                min-height: 80vh;
                display: flex;
                align-items: center;
                overflow: hidden;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .hero-content {
                position: relative;
                z-index: 1;
                background: radial-gradient(circle at 50% 50%,
                            rgba(var(--background-primary-rgb), 0) 0%,
                            rgba(var(--background-primary-rgb), 0.15) 70%,
                            rgba(var(--background-primary-rgb), 0.25) 100%);
                padding: 2rem;
                border-radius: 16px;
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
            }
        `;
        document.head.appendChild(styleElement);
    }
}

/**
 * Анимация элемента с использованием Web Animations API
 * @param {string|Element} element - CSS селектор или DOM элемент
 * @param {Object} keyframes - Ключевые кадры анимации
 * @param {Object} options - Настройки анимации
 * @returns {Animation|null} - Объект анимации или null, если элемент не найден
 */
function animateElement(element, keyframes, options) {
    // Определяем элемент
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    
    // Проверяем, что элемент найден
    if (!el) {
        console.warn('Элемент не найден:', element);
        return null;
    }
    
    // Применяем анимацию с использованием Web Animations API
    try {
        return el.animate(keyframes, options);
    } catch (error) {
        console.error('Ошибка при анимации элемента:', error);
        return null;
    }
}

/**
 * Анимация для заголовка сайта (шапки)
 */
function initHeaderAnimations() {
    // Анимация для логотипа и навигации в шапке
    const logo = document.querySelector('.navbar-brand');
    const navItems = document.querySelectorAll('.navbar-nav .nav-item');
    
    if (logo) {
        animateElement(logo, {
            opacity: [0, 1],
            transform: ['translateX(-20px)', 'translateX(0)']
        }, {
            duration: 600,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'both'
        });
    }
    
    navItems.forEach((item, index) => {
        animateElement(item, {
            opacity: [0, 1],
            transform: ['translateY(-10px)', 'translateY(0)']
        }, {
            duration: 600,
            delay: 100 + (index * 100),
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'both'
        });
    });
}

/**
 * Анимация для сервисных карточек и разделов
 */
function initServiceAnimations() {
    // Простая заглушка функции, которая также вызывается в DOMContentLoaded,
    // но пока не определена; можно добавить фактическую анимацию при необходимости
    console.log('Сервисные анимации инициализированы');
}

/**
 * Анимация появления карточек проектов
 */
function initProjectsAnimations() {
    if (!document.querySelector('.projects-grid')) {
        return;
    }
    
    // Анимация для заголовка страницы проектов
    animateElement('.projects-header h1', {
        opacity: [0, 1],
        transform: ['translateY(-20px)', 'translateY(0)']
    }, {
        duration: 800,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both'
    });
    
    // Анимация для подзаголовка
    animateElement('.projects-header .lead', {
        opacity: [0, 1],
        transform: ['translateY(-10px)', 'translateY(0)']
    }, {
        duration: 800,
        delay: 200,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both'
    });
    
    // Анимация для карточек статистики
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        animateElement(card, {
            opacity: [0, 1],
            transform: ['translateY(20px)', 'translateY(0)']
        }, {
            duration: 600,
            delay: 300 + (index * 100),
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'both'
        });
    });
    
    // Анимация для карточек проектов с эффектом каскада
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        animateElement(card, {
            opacity: [0, 1],
            transform: ['translateY(40px)', 'translateY(0)']
        }, {
            duration: 700,
            delay: 600 + (index * 120),
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'both'
        });
    });
    
    // Анимация для секции призыва к действию
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Анимация заголовка
                    animateElement('.cta-section h2', {
                        opacity: [0, 1],
                        transform: ['translateY(20px)', 'translateY(0)']
                    }, {
                        duration: 700,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        fill: 'both'
                    });
                    
                    // Анимация текста
                    animateElement('.cta-section .lead', {
                        opacity: [0, 1],
                        transform: ['translateY(15px)', 'translateY(0)']
                    }, {
                        duration: 700,
                        delay: 200,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        fill: 'both'
                    });
                    
                    // Анимация кнопки
                    animateElement('.cta-section .btn', {
                        opacity: [0, 1],
                        transform: ['translateY(10px) scale(0.95)', 'translateY(0) scale(1)']
                    }, {
                        duration: 700,
                        delay: 400,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        fill: 'both'
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        observer.observe(ctaSection);
    }
}

// Вызов инициализации анимаций после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Существующие инициализации
    initHeaderAnimations();
    initServiceAnimations();
    // ...
    
    // Новая инициализация для страницы проектов
    initProjectsAnimations();
});