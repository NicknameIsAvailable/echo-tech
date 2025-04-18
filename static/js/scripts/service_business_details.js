document.addEventListener("DOMContentLoaded", function () {
    // Apply theme-specific classes on load
    applyThemeClasses();

    // Подготавливаем все элементы для анимации
    prepareElementsForAnimation();

    // Запускаем анимацию для видимых элементов сразу
    showInitialElements();

    // Запускаем наблюдение за прокруткой
    setupScrollAnimation();

    // Listen for theme changes
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "data-theme") {
          applyThemeClasses();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Анимация элементов технологического стека
    setupTechStackAnimation();

    // Функция для применения стилей темы
    function applyThemeClasses() {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const serviceCards = document.querySelectorAll(".service-card");
      const darkCards = document.querySelectorAll(".dark-card");
      const serviceDetailPage = document.querySelector(".service-details-page");

      // Применяем нужные цвета ко всей странице
      if (serviceDetailPage) {
        if (currentTheme === "dark") {
          serviceDetailPage.style.backgroundColor = "var(--background-primary)";
          serviceDetailPage.style.color = "var(--text-primary)";
        } else {
          serviceDetailPage.style.backgroundColor = "var(--background-primary)";
          serviceDetailPage.style.color = "var(--text-primary)";
        }
      }

      // Для карточек услуг
      serviceCards.forEach((card) => {
        if (currentTheme === "dark") {
          card.classList.add("dark-card");
        } else {
          card.classList.remove("dark-card");
        }
      });

      // Для фиксированных dark-card элементов (боковая панель)
      darkCards.forEach((card) => {
        if (!card.classList.contains("service-card")) {
          if (currentTheme === "dark") {
            card.style.backgroundColor = "rgba(45, 55, 72, 0.6)";
            card.style.borderColor = "rgba(255, 255, 255, 0.1)";
          } else {
            card.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
            card.style.borderColor = "rgba(0, 0, 0, 0.08)";
            card.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.08)";
          }
        }
      });

      // Обновление стилей для заголовков
      const titles = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, .section-title"
      );
      titles.forEach((title) => {
        title.style.color =
          currentTheme === "dark"
            ? "var(--text-primary)"
            : "var(--heading-color)";
      });

    // Обновление стилей для элементов преимуществ
        const advantageBoxes = document.querySelectorAll(
            ".advantage-box-detailed"
        );
        advantageBoxes.forEach((box) => {
        if (currentTheme === "dark") {
            box.style.backgroundColor = "var(--background-secondary)";
            box.style.borderLeftColor = "var(--primary-color)";
        } else {
            box.style.backgroundColor = "var(--background-secondary)";
            box.style.borderLeftColor = "var(--primary-color)";
        }
        });

      // Обновление стилей для тех-боксов
      const techBoxes = document.querySelectorAll(".tech-box");
      techBoxes.forEach((box) => {
        if (currentTheme === "dark") {
          box.style.background =
            "linear-gradient(to right, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.05))";
        } else {
          box.style.background =
            "linear-gradient(to right, rgba(var(--primary-rgb), 0.08), rgba(var(--primary-rgb), 0.03))";
        }
      });

      // Обновление стилей для текстовых элементов
      const paragraphs = document.querySelectorAll(
        "p, .lead, .service-benefit, .result-box span"
      );
      paragraphs.forEach((p) => {
        p.style.color =
          currentTheme === "dark"
            ? "var(--text-primary)"
            : "var(--text-primary)";
      });
    }

    // Функция для анимации технологического стека
    function setupTechStackAnimation() {
      // Установим переменную для порядка анимации технических элементов
      const techItems = document.querySelectorAll(".tech-stack-item");
      techItems.forEach((item, index) => {
        // Установка задержки анимации основываясь на позиции
        item.style.setProperty("--animation-order", (index % 3) + 1);
      });

      // Анимация при наведении на элементы технологического стека
      const techStackItems = document.querySelectorAll(".tech-stack-item");
      techStackItems.forEach((item) => {
        item.addEventListener("mouseenter", function () {
          const icon = this.querySelector(".tech-stack-item-icon");
          icon.style.transform = "scale(1.2) rotate(10deg)";
        });

        item.addEventListener("mouseleave", function () {
          const icon = this.querySelector(".tech-stack-item-icon");
          icon.style.transform = "scale(1) rotate(0deg)";
        });
      });

      // Создаем анимацию случайного появления пульсации для иконок
      setInterval(() => {
        const randomIndex = Math.floor(Math.random() * techStackItems.length);
        const randomIcon = techStackItems[randomIndex]?.querySelector(
          ".tech-stack-item-icon"
        );
        if (randomIcon) {
          randomIcon.classList.add("pulse-random");
          setTimeout(() => {
            randomIcon.classList.remove("pulse-random");
          }, 1500);
        }
      }, 3000);

      // Добавим стиль для случайной пульсации
      const style = document.createElement("style");
      style.innerHTML = `
                @keyframes pulseRandom {
                    0% {
                        box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.6);
                    }
                    50% {
                        box-shadow: 0 0 0 15px rgba(var(--primary-rgb), 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
                    }
                }
                
                .pulse-random {
                    animation: pulseRandom 1.5s ease-out;
                }
            `;
      document.head.appendChild(style);
    }

    // Функция для подготовки элементов к анимации
    function prepareElementsForAnimation() {
      // Добавляем класс animate-element ко всем элементам, которые нужно анимировать
      const elementsToAnimate = document.querySelectorAll(
        ".service-card, .result-box, .info-content, .dark-card:not(.service-card), .section-header"
      );

      elementsToAnimate.forEach((el) => {
        el.classList.add("animate-element");
      });
    }

    // Функция для показа элементов первого экрана без задержки
    function showInitialElements() {
      // Элементы, которые должны быть видны сразу
      const initialVisibleElements = document.querySelectorAll(
        ".service-detail-header, .breadcrumb, .section-header:first-of-type"
      );

      initialVisibleElements.forEach((el) => {
        el.classList.add("initial-visible");
      });
    }

    // Функция для настройки анимации при прокрутке
    function setupScrollAnimation() {
      // Используем IntersectionObserver для отслеживания видимости элементов
      const animationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Если элемент виден и еще не анимирован
            if (
              entry.isIntersecting &&
              !entry.target.classList.contains("animated")
            ) {
              // Добавляем класс для запуска анимации
              entry.target.classList.add("animated");
              // Прекращаем наблюдение за этим элементом
              animationObserver.unobserve(entry.target);
            }
          });
        },
        {
          // Настройки для более раннего срабатывания
          threshold: 0.05,
          rootMargin: "0px 0px -20px 0px",
        }
      );

      // Начинаем отслеживать все подготовленные элементы
      document
        .querySelectorAll(".animate-element:not(.initial-visible)")
        .forEach((el) => {
          animationObserver.observe(el);
        });
    }

    // Функция для добавления анимаций при наведении
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        const benefits = this.querySelectorAll(".service-benefit");
        benefits.forEach((benefit, idx) => {
          benefit.style.transitionDelay = `${idx * 0.03}s`;
          benefit.style.transform = "translateX(5px)";
        });
      });

      card.addEventListener("mouseleave", function () {
        const benefits = this.querySelectorAll(".service-benefit");
        benefits.forEach((benefit) => {
          benefit.style.transitionDelay = "0s";
          benefit.style.transform = "translateX(0)";
        });
      });

      // Добавляем курсор pointer для карточек
      card.style.cursor = "pointer";
    });

    // Добавляем пульсирующую анимацию для иконок
    const serviceIconLarge = document.querySelector(".service-icon-large");
    if (serviceIconLarge) {
      setInterval(() => {
        serviceIconLarge.classList.add("pulse-animation");
        setTimeout(() => {
          serviceIconLarge.classList.remove("pulse-animation");
        }, 1000);
      }, 3000);
    }

    // Проверяем, все ли тексты помещаются в контейнеры
    fixTextOverflow();

    // Функция для исправления проблем с переполнением текста
    function fixTextOverflow() {
      const elements = document.querySelectorAll(
        ".service-benefit, .service-results p, .tech-box span, .result-box span"
      );

      elements.forEach((el) => {
        el.style.whiteSpace = "normal";
        el.style.overflow = "visible";
        el.style.textOverflow = "clip";
        el.style.wordWrap = "break-word";
        el.style.lineHeight = "1.6";
      });
    }

    // Добавляем стиль анимации пульсации
    const style = document.createElement("style");
    style.innerHTML = `
            @keyframes pulse-animation {
                0% {
                    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4);
                    transform: scale(1);
                }
                50% {
                    box-shadow: 0 0 0 15px rgba(var(--primary-rgb), 0);
                    transform: scale(1.05);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
                    transform: scale(1);
                }
            }
            
            .pulse-animation {
                animation: pulse-animation 1s cubic-bezier(0.4, 0, 0.6, 1);
            }
        `;
    document.head.appendChild(style);
  });
