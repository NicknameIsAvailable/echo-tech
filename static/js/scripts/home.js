  // This script will be initialized by animations.js and visualizations.js
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize 3D animation for hero section
    initHeroAnimation("hero-canvas");

    // Инициализация всплывающих подсказок (tooltips)
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        trigger: "hover",
        placement: "top",
        html: false,
        animation: true,
        delay: { show: 200, hide: 100 },
      });
    });

    // Анимация появления категорий и их описаний
    const techCategories = document.querySelectorAll(".tech-category-heading");
    const techDescriptions = document.querySelectorAll(
      ".tech-category-description"
    );

    techCategories.forEach((category, categoryIndex) => {
      setTimeout(() => {
        category.style.opacity = "1";

        // Также показываем соответствующее описание с небольшой задержкой
        if (techDescriptions[categoryIndex]) {
          setTimeout(() => {
            techDescriptions[categoryIndex].style.opacity = "1";
          }, 100);
        }
      }, categoryIndex * 150);
    });

    // Анимация появления иконок технологий
    document.querySelectorAll(".tech-item").forEach((item, index) => {
      // Находим родительский контейнер категории
      const parentPanel = item.closest(".tech-category-panel");
      const categoryIndex = Array.from(
        document.querySelectorAll(".tech-category-panel")
      ).indexOf(parentPanel);

      // Добавляем базовую задержку для категории + задержку для элемента
      const categoryDelay = 200 * (categoryIndex + 1);
      const itemDelay = 50 * (index % 6); // 6 элементов в ряду

      // Скрываем элемент изначально
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";

      // Добавляем задержку для поочередного появления
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, categoryDelay + itemDelay);
    });

    // Анимация для блока перенаправления
    const solutionRedirectCard = document.querySelector(
      ".solution-redirect-card"
    );
    setTimeout(() => {
      if (solutionRedirectCard) {
        solutionRedirectCard.classList.add("fade-in-up");
      }
    }, 300);
  });
