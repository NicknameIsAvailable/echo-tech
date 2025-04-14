/**
 * Enhanced Theme Switcher for EchoTech website
 * Provides smooth, flicker-free transitions between light/dark themes
 * With instant text color change fix
 */

document.addEventListener('DOMContentLoaded', () => {
    // Применяем тему до рендеринга контента
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDarkMode ? 'dark' : 'light');

    // Устанавливаем атрибут темы и добавляем CSS для мгновенного применения цветов
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Создаем и добавляем стили для мгновенного назначения цвета текста
    const initialStyles = document.createElement('style');
    initialStyles.id = 'initial-theme-styles';
    initialStyles.textContent = `
        * {
            transition: none !important;
        }
        
        html[data-theme="${initialTheme}"] body {
            color: ${initialTheme === 'dark' ? '#e2e8f0' : '#2d3748'} !important;
        }
        
        html[data-theme="${initialTheme}"] p,
        html[data-theme="${initialTheme}"] h1,
        html[data-theme="${initialTheme}"] h2,
        html[data-theme="${initialTheme}"] h3,
        html[data-theme="${initialTheme}"] h4,
        html[data-theme="${initialTheme}"] h5,
        html[data-theme="${initialTheme}"] h6,
        html[data-theme="${initialTheme}"] span:not(.badge):not(.slider),
        html[data-theme="${initialTheme}"] a:not(.btn),
        html[data-theme="${initialTheme}"] li,
        html[data-theme="${initialTheme}"] label {
            color: ${initialTheme === 'dark' ? '#e2e8f0' : '#2d3748'} !important;
        }
    `;
    document.head.appendChild(initialStyles);

    // Применяем класс темы к body
    if (initialTheme === 'dark') {
        document.body.classList.add('dark-theme');

        // Добавляем класс dark-card к карточкам
        document.querySelectorAll('.service-segment-card').forEach(card => {
            card.classList.add('dark-card');
        });
    }

    // Инициализируем переключатель темы
    initThemeSwitcher();

    // Применяем специфические настройки темы
    handleThemeSpecificImages(initialTheme);
    adjustSvgElementsForTheme(initialTheme);

    // Удаляем временные стили через короткое время
    setTimeout(() => {
        if (document.getElementById('initial-theme-styles')) {
            document.head.removeChild(initialStyles);
        }
    }, 300);

    // Проверка на оставшиеся блокировщики
    setTimeout(() => {
        clearThemeBlockers();
    }, 1500);
});

/**
 * Get current theme from HTML attribute
 * @returns {string} Current theme ('light' or 'dark')
 */
function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        return savedTheme;
    } else {
        return prefersDarkMode ? 'dark' : 'light';
    }
}

/**
 * Clear any stuck theme transition blockers
 */
function clearThemeBlockers() {
    // Remove overlay blockers
    const blockerOverlay = document.getElementById('theme-transition-blocker');
    if (blockerOverlay && document.body.contains(blockerOverlay)) {
        document.body.removeChild(blockerOverlay);
    }

    // Remove any text transition blockers
    const textBlocker = document.getElementById('text-transition-blocker');
    if (textBlocker && document.head.contains(textBlocker)) {
        document.head.removeChild(textBlocker);
    }

    // Ensure pointer events are restored
    document.body.style.pointerEvents = '';

    // Remove transitioning classes
    document.documentElement.classList.remove('theme-transitioning');
    document.body.classList.remove('theme-transition-complete');
}

// Make clearThemeBlockers globally accessible
window.clearThemeBlockers = clearThemeBlockers;

/**
 * Initialize the theme switcher with improved error handling
 */
function initThemeSwitcher() {
    // Clear any existing blockers first
    clearThemeBlockers();

    // Add global error handler to prevent stuck overlays
    window.addEventListener('error', function() {
        console.log("Error detected, clearing theme transition state");
        clearThemeBlockers();
    });

    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

    if (!themeToggle && !mobileThemeToggle) return;

    // Set initial toggle states based on current theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);

    const isDarkTheme = initialTheme === 'dark';
    if (themeToggle) themeToggle.checked = isDarkTheme;
    if (mobileThemeToggle) mobileThemeToggle.checked = isDarkTheme;

    // Initially disable transitions to prevent animation on page load
    document.documentElement.classList.add('no-transition');

    // Add theme-transition-target class to elements that need smooth transitions
    prepareElementsForTransition();

    // Remove the no-transition class after the DOM is stable
    setTimeout(() => {
        document.documentElement.classList.remove('no-transition');
    }, 50);

    // Add event listeners for toggles with enhanced animation
    setupToggleListeners(themeToggle, mobileThemeToggle);

    // Listen for system preference changes
    setupSystemPreferenceListener(themeToggle, mobileThemeToggle);
}

/**
 * Prepare elements for smooth theme transitions
 */
function prepareElementsForTransition() {
    // Elements that should have theme transitions applied
    const elementsToTransition = document.querySelectorAll(
        '.card, .btn, .navbar, .footer, section, .slider, ' +
        'input, select, textarea, .visualization-container, ' +
        '.site-header, .site-footer, .hero-section, .service-card, ' +
        '.project-card, .team-member, .testimonial-card, .contact-form, ' +
        '.tech-stack-item, .feature-box, .pricing-card, .alert, .modal, ' +
        '.dropdown-menu, .nav-link, a, button, h1, h2, h3, h4, h5, h6, p, ' +
        'blockquote, pre, code, .table, .img-fluid, .bg-image, .icon'
    );

    elementsToTransition.forEach(element => {
        element.classList.add('theme-transition-target');
    });

    // Special transition handling for visualizations
    const visualizations = document.querySelectorAll(
        '.tech-stack-visualization, .service-visualization-container, ' +
        '.project-visualization-container, [data-visualization="true"], ' +
        'svg, .d3-visualization, canvas, .chart-container'
    );

    visualizations.forEach(viz => {
        if (!viz.hasAttribute('data-theme-transition')) {
            viz.setAttribute('data-theme-transition', 'true');
        }
        viz.classList.add('theme-transition-target');
    });

    // Add hover transition support
    addHoverTransitionSupport();
}

/**
 * Setup event listeners for theme toggle switches
 * @param {HTMLElement} themeToggle - Desktop theme toggle
 * @param {HTMLElement} mobileThemeToggle - Mobile theme toggle
 */
function setupToggleListeners(themeToggle, mobileThemeToggle) {
    // Add event listener for desktop toggle
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const isDark = this.checked;

            // Add animation to the toggle itself
            const toggleWrapper = this.closest('.theme-switch');
            if (toggleWrapper) toggleWrapper.classList.add('toggling');
            setTimeout(() => {
                if (toggleWrapper) toggleWrapper.classList.remove('toggling');
            }, 600);

            toggleTheme(isDark);
            if (mobileThemeToggle) mobileThemeToggle.checked = isDark;
        });
    }

    // Add event listener for mobile toggle
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('change', function() {
            const isDark = this.checked;

            // Add animation to the toggle itself
            const toggleWrapper = this.closest('.theme-switch');
            if (toggleWrapper) toggleWrapper.classList.add('toggling');
            setTimeout(() => {
                if (toggleWrapper) toggleWrapper.classList.remove('toggling');
            }, 600);

            toggleTheme(isDark);
            if (themeToggle) themeToggle.checked = isDark;
        });
    }
}

/**
 * Setup listener for system color scheme preference changes
 * @param {HTMLElement} themeToggle - Desktop theme toggle
 * @param {HTMLElement} mobileThemeToggle - Mobile theme toggle
 */
function setupSystemPreferenceListener(themeToggle, mobileThemeToggle) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only react to system changes if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            const newDarkMode = e.matches;
            toggleTheme(newDarkMode);
            if (themeToggle) themeToggle.checked = newDarkMode;
            if (mobileThemeToggle) mobileThemeToggle.checked = newDarkMode;
        }
    });
}

/**
 * Add support for smooth transitions on hover effects
 */
function addHoverTransitionSupport() {
    // Add hover transition classes to appropriate elements
    const hoverElements = document.querySelectorAll(
        'a, button, .btn, .card, .nav-link, .navbar-brand, ' +
        '.social-icon, .feature-box, .service-card, .project-card'
    );

    hoverElements.forEach(element => {
        element.classList.add('hover-transition');
    });

    // Add CSS rule for hover transitions if it doesn't exist
    if (!document.getElementById('hover-transition-style')) {
        const style = document.createElement('style');
        style.id = 'hover-transition-style';
        style.textContent = `
            .hover-transition {
                transition: transform 0.3s ease, 
                           box-shadow 0.3s ease,
                           color 0.3s ease,
                           background-color 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Улучшенная функция переключения темы с плавной анимацией
 * @param {boolean} isDark - Переключение на тёмную тему (true) или на светлую (false)
 */
function toggleTheme(isDark) {
    const theme = isDark ? 'dark' : 'light';
    const currentTheme = document.documentElement.getAttribute('data-theme');

    // Если тема уже установлена, просто выходим
    if (theme === currentTheme) return;

    // Создаем плавный переход с помощью оверлея
    const overlay = document.createElement('div');
    overlay.id = 'smooth-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${isDark ? '#1a202c' : '#ffffff'};
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s ease-in-out;
    `;
    document.body.appendChild(overlay);

    // Создаем стили для мгновенного изменения цвета текста,
    // но они будут применены только когда оверлей будет полностью непрозрачным
    const textStyles = document.createElement('style');
    textStyles.id = 'text-color-styles';
    textStyles.textContent = `
        html[data-theme="${theme}"] body,
        html[data-theme="${theme}"] p,
        html[data-theme="${theme}"] h1,
        html[data-theme="${theme}"] h2,
        html[data-theme="${theme}"] h3,
        html[data-theme="${theme}"] h4,
        html[data-theme="${theme}"] h5,
        html[data-theme="${theme}"] h6,
        html[data-theme="${theme}"] span:not(.badge):not(.slider),
        html[data-theme="${theme}"] a:not(.btn),
        html[data-theme="${theme}"] li,
        html[data-theme="${theme}"] label {
            color: ${isDark ? '#e2e8f0' : '#2d3748'} !important;
        }
    `;

    // Плавно показываем оверлей
    requestAnimationFrame(() => {
        overlay.style.opacity = '0.92';

        // Когда оверлей достаточно непрозрачен, меняем тему
        setTimeout(() => {
            // 1. Добавляем стили для цвета текста
            document.head.appendChild(textStyles);

            // 2. Меняем тему
            document.documentElement.setAttribute('data-theme', theme);

            // 3. Переключаем классы
            if (isDark) {
                document.body.classList.add('dark-theme');
                document.querySelectorAll('.service-segment-card').forEach(card => {
                    card.classList.add('dark-card');
                });
            } else {
                document.body.classList.remove('dark-theme');
            }

            // 4. Сохраняем тему и применяем специфические настройки
            localStorage.setItem('theme', theme);
            handleThemeSpecificImages(theme);
            adjustSvgElementsForTheme(theme);
            updateTechStackAndVisualizations(theme);
            prepareLogosForTransition(theme);

            // 5. Обновляем модальные окна
            fixModals();

            // 6. Запускаем событие изменения темы
            document.dispatchEvent(new CustomEvent('theme-changed', {
                detail: { theme: theme }
            }));

            // 7. Плавно скрываем оверлей
            setTimeout(() => {
                overlay.style.opacity = '0';

                // 8. Когда оверлей полностью скрыт, удаляем его
                setTimeout(() => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }

                    // Удаляем временные стили
                    if (document.head.contains(textStyles)) {
                        document.head.removeChild(textStyles);
                    }

                    // Финальное обновление цвета текста
                    forceTextColorUpdate(theme);
                }, 400);
            }, 100);
        }, 300);
    });
}

/**
 * Принудительно обновляет цвет текста на всей странице
 * @param {string} theme - Текущая тема ('light' или 'dark')
 */
function forceTextColorUpdate(theme) {
    // Определяем цвета для разных тем
    const textColor = theme === 'dark' ? '#e2e8f0' : '#2d3748';
    const secondaryTextColor = theme === 'dark' ? '#a0aec0' : '#718096';

    // Обходим все текстовые элементы и устанавливаем цвет принудительно
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a:not(.btn), li, label');
    textElements.forEach(element => {
        // Не меняем цвет для элементов с явно заданными классами цвета
        if (!element.className.includes('text-') &&
            !element.className.includes('btn') &&
            !element.className.includes('nav-link')) {
            element.style.color = textColor;
        }
    });

    // Отдельно обрабатываем элементы с вторичным цветом текста
    const secondaryTextElements = document.querySelectorAll('.text-secondary, .text-muted');
    secondaryTextElements.forEach(element => {
        element.style.color = secondaryTextColor;
    });
}
/**
 * Prepare logos for smooth theme transition
 * @param {string} theme - Target theme ('light' or 'dark')
 */
function prepareLogosForTransition(theme) {
    const lightLogo = document.querySelector('.light-theme-logo');
    const darkLogo = document.querySelector('.dark-theme-logo');

    if (lightLogo && darkLogo) {
        // Pre-load the new logo before transition starts
        const currentLogo = theme === 'light' ? lightLogo : darkLogo;
        const otherLogo = theme === 'light' ? darkLogo : lightLogo;

        // Start showing the correct logo
        currentLogo.style.opacity = '1';
        otherLogo.style.opacity = '0';
    }
}

/**
 * Create transition blocker to prevent interaction during theme change
 */
function createThemeTransitionBlocker() {
    // Disable pointer events during transition
    document.body.style.pointerEvents = 'none';

    // Create overlay for preventing clicks during animation
    const preventClickOverlay = document.createElement('div');
    preventClickOverlay.id = 'theme-transition-blocker';
    preventClickOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1040;
        background-color: transparent;
    `;
    document.body.appendChild(preventClickOverlay);
}

/**
 * Updates Tech Stack containers and visualizations
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateTechStackAndVisualizations(theme) {
    // Update Tech Stack containers
    document.querySelectorAll('[data-tech-stack="true"]').forEach(techStackEl => {
        techStackEl.setAttribute('data-theme', theme);
        if (techStackEl.id && window.initTechStackVisualization) {
            window.initTechStackVisualization(techStackEl.id);
        }
    });

    // Update visualizations
    document.querySelectorAll('[data-visualization="true"]').forEach(vizEl => {
        vizEl.setAttribute('data-theme', theme);
    });

    // Call global visualization update function if available
    if (window.updateVisualizationsTheme) {
        window.updateVisualizationsTheme(theme);
    }
    
    // Update hero section background circles
    updateHeroBackgroundCircles(theme);
}

/**
 * Update hero section background circles for the current theme
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateHeroBackgroundCircles(theme) {
    const circlesContainer = document.querySelector('.circles-background');
    if (!circlesContainer) return;
    
    // Get computed style variables
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColorRGB = computedStyle.getPropertyValue('--primary-rgb').trim().split(',');
    
    // Update all existing circles with new colors
    const circles = circlesContainer.querySelectorAll('.background-circle');
    
    if (circles.length > 0) {
        circles.forEach(circle => {
            // Extract opacity from current background
            const backgroundStyle = circle.style.background;
            const opacity = backgroundStyle.includes('rgba') 
                ? parseFloat(backgroundStyle.split(',')[3]) 
                : 0.1;
            
            // Update circle color
            circle.style.background = `rgba(${primaryColorRGB[0]}, ${primaryColorRGB[1]}, ${primaryColorRGB[2]}, ${opacity})`;
        });
    } else if (window.initHeroBackgroundCircles) {
        // If no circles found but function exists, initialize them
        window.initHeroBackgroundCircles();
    }
}

/**
 * Fix modals during theme change
 */
function fixModals() {
    // Clear theme blockers
    if (window.clearThemeBlockers) {
        window.clearThemeBlockers();
    }

    // Apply current theme to modal windows
    if (window.fixAllModalThemes) {
        setTimeout(() => {
            window.fixAllModalThemes();
        }, 10);
    }

    // Apply all fixes to modal windows
    if (window.fixAllModals) {
        setTimeout(() => {
            window.fixAllModals();
        }, 50);
    }
}

/**
 * Complete theme transition and clean up
 */
function completeThemeTransition() {
    // Remove overlay and re-enable interaction
    const overlay = document.getElementById('theme-transition-blocker');
    if (overlay && document.body.contains(overlay)) {
        document.body.removeChild(overlay);
    }

    document.body.style.pointerEvents = '';

    // Проверяем, нет ли застрявших стилей блокировки
    if (document.getElementById('text-transition-blocker')) {
        document.head.removeChild(document.getElementById('text-transition-blocker'));
    }

    // Apply post-transition effect
    document.body.classList.add('theme-transition-complete');
    setTimeout(() => {
        document.body.classList.remove('theme-transition-complete');
        document.documentElement.classList.remove('theme-transitioning');

        // Финальное обновление цвета текста для подстраховки
        const theme = document.documentElement.getAttribute('data-theme');
        forceTextColorUpdate(theme);
    }, 200);
}

/**
 * Add a subtle animation when changing themes
 */
function addThemeChangeAnimation() {
    // Create animation overlay
    const animation = document.createElement('div');
    animation.classList.add('theme-transition-overlay');
    animation.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 1030;
        pointer-events: none;
        opacity: 0;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(0px);
        mix-blend-mode: luminosity;
    `;
    document.body.appendChild(animation);

    // Get theme toggle position for ripple effect
    const themeToggle = document.querySelector('.theme-switch:hover, .theme-switch:focus') ||
                      document.querySelector('.theme-switch') ||
                      document.querySelector('.navbar');

    // Create ripple effect if we have a toggle position
    if (themeToggle) {
        createRippleEffect(themeToggle);
    }

    // Trigger main animation with subtle blur
    requestAnimationFrame(() => {
        animation.style.opacity = '0.1';
        animation.style.backdropFilter = 'blur(2px)';

        // Remove animation after completion
        setTimeout(() => {
            animation.style.opacity = '0';
            animation.style.backdropFilter = 'blur(0px)';

            setTimeout(() => {
                if (document.body.contains(animation)) {
                    document.body.removeChild(animation);
                }
            }, 800);
        }, 300);
    });

    // Apply special transition to cards and sections
    applyStaggeredTransition();
}

/**
 * Create ripple effect animation for theme toggle
 * @param {HTMLElement} themeToggle - Theme toggle element
 */
function createRippleEffect(themeToggle) {
    const rect = themeToggle.getBoundingClientRect();
    const rippleX = rect.left + rect.width / 2;
    const rippleY = rect.top + rect.height / 2;

    const ripple = document.createElement('div');
    ripple.classList.add('theme-transition-ripple');
    ripple.style.cssText = `
        position: fixed;
        top: ${rippleY}px;
        left: ${rippleX}px;
        transform: translate(-50%, -50%) scale(0);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--primary-color);
        opacity: 0.2;
        z-index: 1025;
        pointer-events: none;
        transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(160)';
        ripple.style.opacity = '0';

        // Remove ripple after animation
        setTimeout(() => {
            if (document.body.contains(ripple)) {
                document.body.removeChild(ripple);
            }
        }, 1200);
    });
}

/**
 * Apply staggered transition to cards and sections for visual interest
 */
function applyStaggeredTransition() {
    const cards = document.querySelectorAll('.card, section, .visualization-container');

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${Math.min(index * 10, 200)}ms`;
        card.classList.add('theme-transition-target');

        // Remove delay after transition
        setTimeout(() => {
            card.style.transitionDelay = '';
            card.classList.remove('theme-transition-target');
        }, 800);
    });

    // Force re-apply theme-transition to all visualization elements
    const allVisualizations = document.querySelectorAll('.visualization-container, .tech-stack-visualization, [data-visualization="true"]');

    allVisualizations.forEach(viz => {
        viz.classList.add('theme-transition-target');

        // Reset visualization with delay
        if (viz.hasAttribute('data-tech-stack') && viz.id && window.initTechStackVisualization) {
            setTimeout(() => {
                window.initTechStackVisualization(viz.id);
            }, 300);
        }
    });
}

/**
 * Handle theme-specific images by switching src or applying filters
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function handleThemeSpecificImages(theme) {
    // Switch image sources for theme-specific images
    const themeSpecificImages = document.querySelectorAll('[data-theme-src]');
    themeSpecificImages.forEach(img => {
        const themeData = img.dataset.themeSrc ? JSON.parse(img.dataset.themeSrc) : null;
        if (themeData && themeData[theme]) {
            img.src = themeData[theme];
        }
    });

    // Apply appropriate filters to icons and images based on theme
    const iconImages = document.querySelectorAll('.icon-img, .theme-aware-image');
    iconImages.forEach(img => {
        if (theme === 'dark') {
            if (!img.classList.contains('no-invert')) {
                img.style.filter = 'brightness(1.2)';
            }
        } else {
            if (!img.classList.contains('no-filter')) {
                img.style.filter = 'none';
            }
        }
    });
}

/**
 * Adjust SVG elements for current theme
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function adjustSvgElementsForTheme(theme) {
    // Get all SVG elements
    const svgElements = document.querySelectorAll('svg');

    svgElements.forEach(svg => {
        // Skip SVGs with no-theme-adjust class
        if (svg.classList.contains('no-theme-adjust')) {
            return;
        }

        // Elements to adjust
        const elements = {
            paths: svg.querySelectorAll('path'),
            circles: svg.querySelectorAll('circle'),
            rects: svg.querySelectorAll('rect'),
            texts: svg.querySelectorAll('text')
        };

        if (theme === 'dark') {
            // Adjust for dark theme
            elements.paths.forEach(path => {
                if (!path.getAttribute('data-original-fill')) {
                    path.setAttribute('data-original-fill', path.getAttribute('fill') || 'none');
                }
                if (!path.getAttribute('fill') || path.getAttribute('fill') === '#000000') {
                    path.setAttribute('fill', '#e2e8f0');
                }
            });

            elements.texts.forEach(text => {
                if (!text.getAttribute('data-original-fill')) {
                    text.setAttribute('data-original-fill', text.getAttribute('fill') || '#000000');
                }
                if (text.getAttribute('fill') === '#000000') {
                    text.setAttribute('fill', '#e2e8f0');
                }
            });
        } else {
            // Restore original colors for light theme
            elements.paths.forEach(path => {
                const originalFill = path.getAttribute('data-original-fill');
                if (originalFill) {
                    path.setAttribute('fill', originalFill);
                }
            });

            elements.texts.forEach(text => {
                const originalFill = text.getAttribute('data-original-fill');
                if (originalFill) {
                    text.setAttribute('fill', originalFill);
                }
            });
        }
    });
}

// Export functions for global access
window.getCurrentTheme = getCurrentTheme;
window.toggleTheme = toggleTheme;
window.clearThemeBlockers = clearThemeBlockers;