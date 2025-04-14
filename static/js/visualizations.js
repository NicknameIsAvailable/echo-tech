/**
 * Visualizations for EchoTech website
 * Contains implementations for various data visualizations using D3.js and Three.js
 */

// Store visualization objects for theme updates
const visualizationInstances = {
    techStack: null,
    services: {},
    projects: {},
    map: null
};

// Function to update visualizations when theme changes
// Making this globally available for theme switcher
window.updateVisualizationsTheme = function(theme) {
    console.log("Updating all visualizations to theme:", theme);
    
    // Update theme data attribute on all visualizations
    document.querySelectorAll('[data-visualization="true"]').forEach(el => {
        el.setAttribute('data-theme', theme);
    });
    
    // Force recreation of all visualizations to ensure they have the current theme colors
    
    // Больше не обновляем tech-stack визуализацию - мы заменили ее статическими карточками
    
    // Update service visualizations
    const serviceElements = document.querySelectorAll('.service-visualization');
    serviceElements.forEach(el => {
        const serviceId = el.dataset.service;
        if (serviceId && el.id) {
            // Add transition classes
            el.classList.add('theme-transition-target');
            // Add visualization marker
            el.setAttribute('data-visualization', 'true');
            // Recreate visualization
            setTimeout(() => initServiceVisualization(el.id, serviceId), 20);
        }
    });
    
    // Update project visualizations with improved modal interaction
    const projectElements = document.querySelectorAll('.project-visualization');
    projectElements.forEach(el => {
        const projectClass = el.dataset.project;
        if (projectClass && el.id) {
            // Add transition classes
            el.classList.add('theme-transition-target');
            // Add visualization marker
            el.setAttribute('data-visualization', 'true');
            
            // Проверяем, находится ли визуализация внутри модального окна
            const inModal = el.closest('.modal') !== null;
            
            // Полностью очищаем содержимое для предотвращения проблем наложения
            el.innerHTML = '';
            
            // Улучшаем интерактивность в модальных окнах
            if (inModal) {
                el.style.position = 'relative';
                el.style.zIndex = '5';
            }
            
            // Recreate visualization с учетом положения элемента
            setTimeout(() => {
                try {
                    initProjectVisualization(el.id, projectClass, inModal);
                } catch (error) {
                    console.error("Error initializing project visualization:", error);
                    // Fallback if visualization fails
                    el.innerHTML = `<div class="text-center p-4">
                        <i class="fas fa-code fa-3x mb-3 text-primary"></i>
                        <p>Project visualization</p>
                    </div>`;
                }
            }, 30);
        }
    });
    
    // Update map visualization
    const mapEl = document.getElementById('contact-map-visualization');
    if (mapEl) {
        // Add transition classes
        mapEl.classList.add('theme-transition-target');
        // Add visualization marker
        mapEl.setAttribute('data-visualization', 'true');
        // Recreate visualization
        setTimeout(() => initMapVisualization('contact-map-visualization'), 40);
    }
}

// Function already exported to window scope above

/**
 * Create a static tech stack visualization that doesn't use D3.js
 * @param {string} elementId - The ID of the container element
 */
window.initTechStackVisualization = function(elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    // Mark container for theme transitions
    container.classList.add('theme-transition-target');
    
    // Get current theme
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Create the static tech stack cards instead of D3 visualization
    container.innerHTML = `
        <div class="tech-stack-static-container row g-4">
            <!-- Programming Languages -->
            <div class="col-md-3 col-sm-6">
                <div class="tech-card">
                    <h4 class="tech-card-title">
                        <i class="fas fa-code me-2"></i>Языки
                    </h4>
                    <div class="language-stickers">
                        <span class="language-sticker python"><i class="fab fa-python me-1"></i>Python</span>
                        <span class="language-sticker js"><i class="fab fa-js me-1"></i>JavaScript</span>
                        <span class="language-sticker cpp"><i class="fas fa-microchip me-1"></i>C++</span>
                        <span class="language-sticker sql"><i class="fas fa-database me-1"></i>SQL</span>
                    </div>
                </div>
            </div>
            
            <!-- Frameworks -->
            <div class="col-md-3 col-sm-6">
                <div class="tech-card">
                    <h4 class="tech-card-title">
                        <i class="fas fa-cubes me-2"></i>Фреймворки
                    </h4>
                    <div class="language-stickers">
                        <span class="language-sticker flask"><i class="fas fa-flask me-1"></i>Flask</span>
                        <span class="language-sticker django"><i class="fas fa-fire me-1"></i>Django</span>
                        <span class="language-sticker react"><i class="fab fa-react me-1"></i>React</span>
                        <span class="language-sticker vue"><i class="fab fa-vuejs me-1"></i>Vue.js</span>
                        <span class="language-sticker angular"><i class="fab fa-angular me-1"></i>Angular</span>
                    </div>
                </div>
            </div>
            
            <!-- Technologies -->
            <div class="col-md-3 col-sm-6">
                <div class="tech-card">
                    <h4 class="tech-card-title">
                        <i class="fas fa-cogs me-2"></i>Технологии
                    </h4>
                    <div class="language-stickers">
                        <span class="language-sticker tensorflow"><i class="fas fa-brain me-1"></i>TensorFlow</span>
                        <span class="language-sticker pytorch"><i class="fas fa-fire-alt me-1"></i>PyTorch</span>
                        <span class="language-sticker postgres"><i class="fas fa-table me-1"></i>PostgreSQL</span>
                        <span class="language-sticker mongodb"><i class="fas fa-leaf me-1"></i>MongoDB</span>
                    </div>
                </div>
            </div>
            
            <!-- Infrastructure -->
            <div class="col-md-3 col-sm-6">
                <div class="tech-card">
                    <h4 class="tech-card-title">
                        <i class="fas fa-server me-2"></i>Инфраструктура
                    </h4>
                    <div class="language-stickers">
                        <span class="language-sticker docker"><i class="fab fa-docker me-1"></i>Docker</span>
                        <span class="language-sticker aws"><i class="fab fa-aws me-1"></i>AWS</span>
                        <span class="language-sticker azure"><i class="fas fa-cloud me-1"></i>Azure</span>
                        <span class="language-sticker git"><i class="fab fa-git-alt me-1"></i>Git</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Добавим эффект появления элементов при загрузке
    setTimeout(() => {
        const cards = container.querySelectorAll('.tech-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100);
        });
        
        const stickers = container.querySelectorAll('.language-sticker');
        stickers.forEach((sticker, index) => {
            setTimeout(() => {
                sticker.classList.add('animate-in');
            }, 400 + index * 30);
        });
    }, 100);
}

/**
 * Initialize service visualization for services page
 * @param {string} elementId - The ID of the container element
 * @param {string} serviceId - The service identifier
 */
function initServiceVisualization(elementId, serviceId) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    // Clear previous visualization
    container.innerHTML = '';
    
    // Get theme colors - always get fresh colors when switching themes
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const backgroundColor = isDarkTheme ? '#2d3748' : '#f7fafc';
    const textColor = isDarkTheme ? '#e2e8f0' : '#2d3748';
    const primaryColor = isDarkTheme ? '#6d8cff' : '#4361ee';
    
    // Create service-specific visualization based on serviceId
    switch (serviceId) {
        case 'python-development':
            createPythonVisualization(container, backgroundColor, primaryColor, textColor);
            break;
        case 'sql-data-management':
            createDatabaseVisualization(container, backgroundColor, primaryColor, textColor);
            break;
        case 'cross-platform-apps':
            createCrossPlatformVisualization(container, backgroundColor, primaryColor, textColor);
            break;
        case 'cpp-systems':
            createCppVisualization(container, backgroundColor, primaryColor, textColor);
            break;
        case 'ai-solutions':
            createAIVisualization(container, backgroundColor, primaryColor, textColor);
            break;
        case 'crm-integration':
            createCRMVisualization(container, backgroundColor, primaryColor, textColor);
            break;
        default:
            createDefaultVisualization(container, backgroundColor, primaryColor, textColor);
    }
}

/**
 * Create Python-related visualization
 */
function createPythonVisualization(container, bgColor, primaryColor, textColor) {
    // Clear container
    container.innerHTML = '';
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 300;
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", bgColor);
    
    // Python logo as SVG path
    const pythonLogo = svg.append("g")
        .attr("transform", `translate(${width / 2 - 30}, ${height / 2 - 30}) scale(0.1)`)
        .html(`
            <path d="M 600,210 H 500 V 110 c 0,-43.62 -30,-80 -80,-80 H 260 c -50,0 -80,36.38 -80,80 v 390 c 0,43.62 30,80 80,80 h 160 c 50,0 80,-36.38 80,-80 V 400 h 100 c 50,0 80,-36.38 80,-80 V 290 c 0,-43.62 -30,-80 -80,-80 z m -20,150 c 0,16.54 -13.47,30 -30,30 H 450 c -44.18,0 -80,35.82 -80,80 v 90 c 0,16.54 -13.47,30 -30,30 H 280 c -16.53,0 -30,-13.46 -30,-30 V 120 c 0,-16.54 13.47,-30 30,-30 h 60 c 16.53,0 30,13.46 30,30 v 100 h 210 c 16.53,0 30,13.46 30,30 v 110 z" 
            fill="#3776ab"/>
            <path d="M 400,520 H 300 V 620 c 0,43.62 30,80 80,80 h 160 c 50,0 80,-36.38 80,-80 V 230 c 0,-43.62 -30,-80 -80,-80 H 380 c -50,0 -80,36.38 -80,80 v 100 h 100 c 50,0 80,36.38 80,80 v 30 c 0,43.62 -30,80 -80,80 z m 20,-150 c 0,-16.54 13.47,-30 30,-30 h 60 c 16.53,0 30,13.46 30,30 v 120 c 0,16.54 -13.47,30 -30,30 h -60 c -16.53,0 -30,-13.46 -30,-30 V 370 z" 
            fill="#ffd43b"/>
            <circle cx="330" cy="150" r="25" fill="white"/>
            <circle cx="470" cy="570" r="25" fill="white"/>
        `);
    
    // Add code elements
    const codeElements = [
        { x: 50, y: 70, text: "def" },
        { x: 90, y: 70, text: "hello():" },
        { x: 70, y: 100, text: "print('Hello, World!')" },
        { x: 50, y: 160, text: "class" },
        { x: 100, y: 160, text: "Python:" },
        { x: 70, y: 190, text: "def __init__(self):" },
        { x: 90, y: 220, text: "self.version = '3.10'" }
    ];
    
    // Add floating code
    svg.selectAll(".code-element")
        .data(codeElements)
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .text(d => d.text)
        .attr("font-family", "monospace")
        .attr("font-size", "12px")
        .attr("fill", textColor)
        .attr("opacity", 0.8);
    
    // Add floating libraries
    const libraries = ["Django", "Flask", "NumPy", "Pandas", "TensorFlow"];
    const libraryCircles = svg.selectAll(".library")
        .data(libraries)
        .enter()
        .append("g")
        .attr("transform", (d, i) => {
            const angle = (i / libraries.length) * 2 * Math.PI;
            const radius = Math.min(width, height) * 0.3;
            const x = width * 0.75 + radius * Math.cos(angle);
            const y = height * 0.5 + radius * Math.sin(angle);
            return `translate(${x}, ${y})`;
        });
    
    libraryCircles.append("circle")
        .attr("r", 25)
        .attr("fill", primaryColor)
        .attr("opacity", 0.7);
    
    libraryCircles.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .text(d => d)
        .attr("fill", "#fff")
        .attr("font-size", "10px");
    
    // Add animation
    pythonLogo.style("animation", "float 6s ease-in-out infinite");
    svg.append("style").text(`
        @keyframes float {
            0%, 100% { transform: translate(${width / 2 - 30}px, ${height / 2 - 30}px) scale(0.1); }
            50% { transform: translate(${width / 2 - 30}px, ${height / 2 - 50}px) scale(0.1); }
        }
    `);
}

/**
 * Create SQL & Database related visualization
 */
function createDatabaseVisualization(container, bgColor, primaryColor, textColor) {
    // Clear container
    container.innerHTML = '';
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 300;
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", bgColor);
    
    // Add database cylinder
    const dbGroup = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
    // Database body
    dbGroup.append("ellipse")
        .attr("cx", 0)
        .attr("cy", -40)
        .attr("rx", 60)
        .attr("ry", 20)
        .attr("fill", primaryColor)
        .attr("opacity", 0.8);
    
    dbGroup.append("rect")
        .attr("x", -60)
        .attr("y", -40)
        .attr("width", 120)
        .attr("height", 80)
        .attr("fill", primaryColor)
        .attr("opacity", 0.6);
    
    dbGroup.append("ellipse")
        .attr("cx", 0)
        .attr("cy", 40)
        .attr("rx", 60)
        .attr("ry", 20)
        .attr("fill", primaryColor)
        .attr("opacity", 0.8);
    
    // Data rows
    const rowData = [
        { id: 1, name: "Product A", value: 3500 },
        { id: 2, name: "Product B", value: 2800 },
        { id: 3, name: "Product C", value: 1200 },
        { id: 4, name: "Product D", value: 4000 },
        { id: 5, name: "Product E", value: 2100 }
    ];
    
    // Create table
    const table = svg.append("g")
        .attr("transform", `translate(${width * 0.2}, ${height * 0.2})`);
    
    // Table header
    table.append("rect")
        .attr("width", 200)
        .attr("height", 25)
        .attr("fill", primaryColor);
    
    table.append("text")
        .attr("x", 10)
        .attr("y", 17)
        .text("ID")
        .attr("fill", "#fff")
        .attr("font-size", "12px");
    
    table.append("text")
        .attr("x", 60)
        .attr("y", 17)
        .text("NAME")
        .attr("fill", "#fff")
        .attr("font-size", "12px");
    
    table.append("text")
        .attr("x", 150)
        .attr("y", 17)
        .text("VALUE")
        .attr("fill", "#fff")
        .attr("font-size", "12px");
    
    // Table rows
    rowData.forEach((row, i) => {
        const y = 25 + i * 20;
        
        table.append("rect")
            .attr("y", y)
            .attr("width", 200)
            .attr("height", 20)
            .attr("fill", i % 2 === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)");
        
        table.append("text")
            .attr("x", 10)
            .attr("y", y + 15)
            .text(row.id)
            .attr("fill", textColor)
            .attr("font-size", "12px");
        
        table.append("text")
            .attr("x", 60)
            .attr("y", y + 15)
            .text(row.name)
            .attr("fill", textColor)
            .attr("font-size", "12px");
        
        table.append("text")
            .attr("x", 150)
            .attr("y", y + 15)
            .text(row.value)
            .attr("fill", textColor)
            .attr("font-size", "12px");
    });
    
    // SQL query
    const sqlQuery = svg.append("g")
        .attr("transform", `translate(${width * 0.5}, ${height * 0.7})`);
    
    sqlQuery.append("rect")
        .attr("width", 280)
        .attr("height", 70)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", "rgba(0,0,0,0.1)");
    
    sqlQuery.append("text")
        .attr("x", 10)
        .attr("y", 20)
        .text("SELECT name, SUM(value) as total")
        .attr("fill", textColor)
        .attr("font-size", "12px")
        .attr("font-family", "monospace");
    
    sqlQuery.append("text")
        .attr("x", 10)
        .attr("y", 40)
        .text("FROM products")
        .attr("fill", textColor)
        .attr("font-size", "12px")
        .attr("font-family", "monospace");
    
    sqlQuery.append("text")
        .attr("x", 10)
        .attr("y", 60)
        .text("GROUP BY name HAVING total > 1000;")
        .attr("fill", textColor)
        .attr("font-size", "12px")
        .attr("font-family", "monospace");
    
    // Add some connecting lines
    svg.append("line")
        .attr("x1", width * 0.3)
        .attr("y1", height * 0.3)
        .attr("x2", width * 0.5)
        .attr("y2", height * 0.5)
        .attr("stroke", primaryColor)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4 2");
    
    svg.append("line")
        .attr("x1", width * 0.6)
        .attr("y1", height * 0.7)
        .attr("x2", width * 0.6)
        .attr("y2", height * 0.5)
        .attr("stroke", primaryColor)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4 2");
}

/**
 * Create cross-platform visualization
 */
function createCrossPlatformVisualization(container, bgColor, primaryColor, textColor) {
    // Clear container
    container.innerHTML = '';
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 300;
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", bgColor);
    
    // Create devices
    const deviceTypes = [
        { name: "Mobile", icon: "fa-mobile-alt", x: width * 0.2, y: height * 0.5 },
        { name: "Desktop", icon: "fa-desktop", x: width * 0.5, y: height * 0.3 },
        { name: "Tablet", icon: "fa-tablet-alt", x: width * 0.8, y: height * 0.5 },
        { name: "Watch", icon: "fa-watch", x: width * 0.5, y: height * 0.7 }
    ];
    
    // Add central code block
    const codeBlock = svg.append("g")
        .attr("transform", `translate(${width / 2 - 50}, ${height / 2 - 50})`);
    
    codeBlock.append("rect")
        .attr("width", 100)
        .attr("height", 100)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("fill", primaryColor);
    
    codeBlock.append("text")
        .attr("x", 50)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .text("< / >");
    
    codeBlock.append("text")
        .attr("x", 50)
        .attr("y", 70)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("font-size", "12px")
        .text("One Codebase");
    
    // Create device groups
    deviceTypes.forEach(device => {
        const deviceGroup = svg.append("g")
            .attr("transform", `translate(${device.x}, ${device.y})`);
        
        deviceGroup.append("circle")
            .attr("r", 30)
            .attr("fill", "rgba(255,255,255,0.1)");
        
        // Device icon (using Font Awesome classes)
        deviceGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 5)
            .attr("fill", textColor)
            .attr("class", `fas ${device.icon}`)
            .attr("font-size", "20px")
            .text(function() {
                // This is a hack to render Font Awesome icons in SVG
                // In a real implementation, we'd use the FA SVG directly
                switch (device.icon) {
                    case "fa-mobile-alt": return "📱";
                    case "fa-desktop": return "🖥️";
                    case "fa-tablet-alt": return "📋";
                    case "fa-watch": return "⌚";
                    default: return "";
                }
            });
        
        deviceGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 25)
            .attr("fill", textColor)
            .attr("font-size", "12px")
            .text(device.name);
        
        // Connect device to code block
        svg.append("line")
            .attr("x1", width / 2)
            .attr("y1", height / 2)
            .attr("x2", device.x)
            .attr("y2", device.y)
            .attr("stroke", primaryColor)
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .attr("opacity", 0.6);
    });
    
    // Add frameworks
    const frameworks = ["React Native", "Flutter", "Electron", "PWA"];
    
    frameworks.forEach((framework, i) => {
        const angle = (i / frameworks.length) * 2 * Math.PI;
        const radius = Math.min(width, height) * 0.2;
        const x = width / 2 + radius * Math.cos(angle);
        const y = height / 2 + radius * Math.sin(angle);
        
        svg.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", textColor)
            .text(framework);
    });
}

/**
 * Create C++ performance visualization
 */
function createCppVisualization(container, bgColor, primaryColor, textColor) {
    // Clear container
    container.innerHTML = '';
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 300;
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", bgColor);
    
    // Add C++ logo
    const cppLogo = svg.append("g")
        .attr("transform", `translate(${width * 0.2}, ${height * 0.5})`);
    
    cppLogo.append("text")
        .attr("text-anchor", "middle")
        .attr("font-family", "monospace")
        .attr("font-size", "40px")
        .attr("font-weight", "bold")
        .attr("fill", primaryColor)
        .text("C++");
    
    // Create performance graph data
    const languages = [
        { name: "C++", performance: 95 },
        { name: "Rust", performance: 92 },
        { name: "C", performance: 97 },
        { name: "Java", performance: 70 },
        { name: "Python", performance: 40 }
    ];
    
    // Create performance bar chart
    const chart = svg.append("g")
        .attr("transform", `translate(${width * 0.5}, ${height * 0.3})`);
    
    // Chart title
    chart.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", textColor)
        .attr("y", -20)
        .text("Performance Comparison");
    
    // Create bars
    const barWidth = 30;
    const barSpacing = 10;
    const maxBarHeight = 120;
    
    languages.forEach((lang, i) => {
        const barHeight = (lang.performance / 100) * maxBarHeight;
        const x = i * (barWidth + barSpacing);
        
        chart.append("rect")
            .attr("x", x)
            .attr("y", -barHeight)
            .attr("width", barWidth)
            .attr("height", barHeight)
            .attr("fill", lang.name === "C++" ? primaryColor : `rgba(${lang.performance * 2}, ${lang.performance}, ${255 - lang.performance}, 0.7)`)
            .attr("rx", 3)
            .attr("ry", 3);
        
        chart.append("text")
            .attr("x", x + barWidth / 2)
            .attr("y", -barHeight - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", textColor)
            .text(lang.performance + "%");
        
        chart.append("text")
            .attr("x", x + barWidth / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", textColor)
            .text(lang.name);
    });
    
    // Add code snippet
    const codeSnippet = svg.append("g")
        .attr("transform", `translate(${width * 0.5}, ${height * 0.7})`);
    
    codeSnippet.append("rect")
        .attr("x", -120)
        .attr("y", -40)
        .attr("width", 240)
        .attr("height", 80)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", "rgba(0,0,0,0.1)");
    
    codeSnippet.append("text")
        .attr("x", -110)
        .attr("y", -20)
        .attr("font-family", "monospace")
        .attr("font-size", "10px")
        .attr("fill", textColor)
        .text("#include <iostream>");
    
    codeSnippet.append("text")
        .attr("x", -110)
        .attr("y", 0)
        .attr("font-family", "monospace")
        .attr("font-size", "10px")
        .attr("fill", textColor)
        .text("int main() {");
    
    codeSnippet.append("text")
        .attr("x", -90)
        .attr("y", 20)
        .attr("font-family", "monospace")
        .attr("font-size", "10px")
        .attr("fill", textColor)
        .text("std::cout << \"High Performance\" << std::endl;");
    
    codeSnippet.append("text")
        .attr("x", -110)
        .attr("y", 40)
        .attr("font-family", "monospace")
        .attr("font-size", "10px")
        .attr("fill", textColor)
        .text("}");
}

/**
 * Create AI solutions visualization
 */
function createAIVisualization(container, bgColor, primaryColor, textColor) {
    // Clear container
    container.innerHTML = '';
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 300;
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", bgColor);
    
    // Create neural network visualization
    const layers = [3, 5, 4, 2]; // Number of nodes in each layer
    const layerDistance = width / (layers.length + 1);
    const maxNodesInLayer = Math.max(...layers);
    
    // Create nodes
    let allNodes = [];
    
    layers.forEach((nodesCount, layerIndex) => {
        const x = layerDistance * (layerIndex + 1);
        const nodeSpacing = height / (nodesCount + 1);
        
        for (let i = 0; i < nodesCount; i++) {
            const y = nodeSpacing * (i + 1);
            allNodes.push({ x, y, layer: layerIndex });
            
            // Add node
            svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 10)
                .attr("fill", primaryColor)
                .attr("opacity", 0.8);
        }
    });
    
    // Connect nodes between adjacent layers
    for (let i = 0; i < layers.length - 1; i++) {
        const currentLayerNodes = allNodes.filter(node => node.layer === i);
        const nextLayerNodes = allNodes.filter(node => node.layer === i + 1);
        
        currentLayerNodes.forEach(source => {
            nextLayerNodes.forEach(target => {
                svg.append("line")
                    .attr("x1", source.x)
                    .attr("y1", source.y)
                    .attr("x2", target.x)
                    .attr("y2", target.y)
                    .attr("stroke", primaryColor)
                    .attr("stroke-width", 1)
                    .attr("opacity", 0.3);
            });
        });
    }
    
    // Add layer labels
    svg.append("text")
        .attr("x", layerDistance)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", textColor)
        .text("Input Layer");
    
    svg.append("text")
        .attr("x", layerDistance * 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", textColor)
        .text("Hidden Layer 1");
    
    svg.append("text")
        .attr("x", layerDistance * 3)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", textColor)
        .text("Hidden Layer 2");
    
    svg.append("text")
        .attr("x", layerDistance * 4)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", textColor)
        .text("Output Layer");
    
    // Add brain icon
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("fill", textColor)
        .text("🧠");
    
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", primaryColor)
        .text("AI Solutions");
    
    // Add some animations
    svg.selectAll("circle")
        .data(allNodes)
        .attr("opacity", 0.5)
        .transition()
        .duration(1500)
        .attr("opacity", 0.8)
        .attr("r", 10)
        .on("end", function repeat() {
            d3.select(this)
                .transition()
                .duration(1500)
                .attr("opacity", 0.5)
                .attr("r", 8)
                .transition()
                .duration(1500)
                .attr("opacity", 0.8)
                .attr("r", 10)
                .on("end", repeat);
        });
}

/**
 * Create CRM integration visualization
 */
function createCRMVisualization(container, bgColor, primaryColor, textColor) {
    // Clear container
    container.innerHTML = '';
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 300;
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", bgColor);
    
    // Create CRM hub and connected systems
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create center CRM hub
    svg.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 50)
        .attr("fill", primaryColor);
    
    svg.append("text")
        .attr("x", centerX)
        .attr("y", centerY)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("CRM");
    
    // Connected systems
    const systems = [
        { name: "Sales", icon: "💼" },
        { name: "Marketing", icon: "📢" },
        { name: "Support", icon: "🛠️" },
        { name: "Finance", icon: "💰" },
        { name: "Analytics", icon: "📊" },
        { name: "Inventory", icon: "📦" }
    ];
    
    systems.forEach((system, i) => {
        const angle = (i / systems.length) * 2 * Math.PI;
        const radius = 120;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Add system circle
        svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 30)
            .attr("fill", d3.color(primaryColor).brighter(0.5 * (i % 3)));
        
        // Add system icon
        svg.append("text")
            .attr("x", x)
            .attr("y", y - 5)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "18px")
            .text(system.icon);
        
        // Add system name
        svg.append("text")
            .attr("x", x)
            .attr("y", y + 15)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", "10px")
            .text(system.name);
        
        // Add connecting line
        svg.append("line")
            .attr("x1", centerX)
            .attr("y1", centerY)
            .attr("x2", x)
            .attr("y2", y)
            .attr("stroke", primaryColor)
            .attr("stroke-width", 2)
            .attr("opacity", 0.6);
    });
    
    // Add data flow animation
    systems.forEach((system, i) => {
        const angle = (i / systems.length) * 2 * Math.PI;
        const radius = 120;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Animated data points
        const dataPoint = svg.append("circle")
            .attr("cx", centerX)
            .attr("cy", centerY)
            .attr("r", 4)
            .attr("fill", "white");
        
        function animateData() {
            dataPoint
                .attr("cx", centerX)
                .attr("cy", centerY)
                .transition()
                .duration(2000)
                .attr("cx", x)
                .attr("cy", y)
                .transition()
                .duration(2000)
                .attr("cx", centerX)
                .attr("cy", centerY)
                .on("end", animateData);
        }
        
        // Start animation with delay based on index
        setTimeout(animateData, i * 400);
    });
}

/**
 * Create default visualization if specific one is not available
 */
function createDefaultVisualization(container, bgColor, primaryColor, textColor) {
    // Clear container
    container.innerHTML = '';
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 300;
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", bgColor);
    
    // Add company logo placeholder
    svg.append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", 50)
        .attr("fill", primaryColor);
    
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "16px")
        .text("Echo")
        .append("tspan")
        .attr("fill", "#5271e8")  // Use the exact blue color
        .text("Tech")
        .append("tspan")
        .attr("fill", textColor)
        .text(" HQ");
    
    // Add pulsing animation
    function pulseAnimation() {
        svg.select("circle")
            .transition()
            .duration(1500)
            .attr("r", 60)
            .transition()
            .duration(1500)
            .attr("r", 50)
            .on("end", pulseAnimation);
    }
    
    pulseAnimation();
}

/**
 * Инициализирует визуализацию проекта
 * @param {string} elementId ID элемента для визуализации
 * @param {string} projectType Тип проекта
 * @param {boolean} isDetailed Флаг детальной визуализации
 */
function initProjectVisualization(elementId, projectType, isDetailed = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Очистка элемента
    while (element.firstChild) {
        if (element.lastChild.tagName !== 'I') {
            element.removeChild(element.lastChild);
        } else {
            break;
        }
    }
    
    // Для модальных окон установим пониженный приоритет z-index и отключим события мыши
    if (isDetailed) {
        element.style.pointerEvents = 'none';
    }
    
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    
    // Создаем SVG элемент с отключенными событиями мыши
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.zIndex = '0';
    svg.style.pointerEvents = 'none'; // Важно для предотвращения зависания
    
    // Добавляем SVG в элемент
    element.appendChild(svg);
    
    // Получаем цвета темы
    const colors = getThemeColors();
    
    // Логика для разных типов проектов с минимальной анимацией в модальных окнах
    switch (projectType) {
        case 'financial-dashboard':
            createFinancialVisualization(svg, width, height, isDetailed, colors);
            break;
        case 'ml-recommendation':
            createMLVisualization(svg, width, height, isDetailed, colors);
            break;
        case 'healthcare-app':
            createHealthcareVisualization(svg, width, height, isDetailed, colors);
            break;
        case 'trading-system':
            createTradingVisualization(svg, width, height, isDetailed, colors);
            break;
        case 'crm-integration':
            createCRMVisualization(svg, width, height, isDetailed, colors);
            break;
        case 'nlp-legal':
            createNLPVisualization(svg, width, height, isDetailed, colors);
            break;
        case 'blockchain-logistics':
            createBlockchainVisualization(svg, width, height, isDetailed, colors);
            break;
        case 'smart-home':
            createSmartHomeVisualization(svg, width, height, isDetailed, colors);
            break;
        default:
            createDefaultVisualization(svg, width, height, isDetailed, colors);
    }
}

/**
 * Вспомогательная функция для получения цветов текущей темы
 */
function getThemeColors() {
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    
    return {
        primary: isDarkTheme ? '#6d8cff' : '#4361ee',
        accent: isDarkTheme ? '#00b4d8' : '#0096c7',
        text: isDarkTheme ? '#e2e8f0' : '#2d3748',
        background: isDarkTheme ? '#1a202c' : '#ffffff',
        blockFill: isDarkTheme ? 'rgba(45, 55, 72, 0.8)' : 'rgba(247, 250, 252, 0.8)'
    };
}

/**
 * Создает визуализацию блокчейн-проекта
 * @param {SVGElement} svg SVG-элемент для рисования
 * @param {number} width Ширина
 * @param {number} height Высота
 * @param {boolean} isDetailed Флаг детального представления (в модальном окне)
 * @param {Object} colors Цвета темы
 */
function createBlockchainVisualization(svg, width, height, isDetailed, colors) {
    // Используем переданные цвета или получаем новые, если не переданы
    colors = colors || getThemeColors();
    
    const numBlocks = isDetailed ? 8 : 6; // Уменьшаем количество блоков в модальном окне
    const blockSize = Math.min(width, height) / (numBlocks * 0.3);
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Создание блоков и соединений с упрощенной анимацией для модальных окон
    for (let i = 0; i < numBlocks; i++) {
        const angle = (i / numBlocks) * Math.PI * 2;
        const distance = isDetailed ? (Math.min(width, height) * 0.3) : (Math.min(width, height) * 0.25);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        // Создание блока
        const block = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        block.setAttribute('x', x - blockSize / 2);
        block.setAttribute('y', y - blockSize / 2);
        block.setAttribute('width', blockSize);
        block.setAttribute('height', blockSize);
        block.setAttribute('rx', blockSize / 6);
        block.setAttribute('fill', colors.blockFill);
        block.setAttribute('stroke', colors.primary);
        block.setAttribute('stroke-width', 1.5);
        block.style.pointerEvents = 'none'; // Важно для предотвращения зависания
        svg.appendChild(block);
        
        // Анимация блока только если не в модальном окне или упрощенная
        if (!isDetailed) {
            const animateBlock = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            animateBlock.setAttribute('attributeName', 'opacity');
            animateBlock.setAttribute('values', '0.5;1;0.5');
            animateBlock.setAttribute('dur', `${2 + i * 0.5}s`);
            animateBlock.setAttribute('repeatCount', 'indefinite');
            block.appendChild(animateBlock);
        }
        
        // Соединение с предыдущим блоком
        if (i > 0) {
            const prevAngle = ((i - 1) / numBlocks) * Math.PI * 2;
            const prevX = centerX + Math.cos(prevAngle) * distance;
            const prevY = centerY + Math.sin(prevAngle) * distance;
            
            const link = document.createElementNS("http://www.w3.org/2000/svg", "line");
            link.setAttribute('x1', prevX);
            link.setAttribute('y1', prevY);
            link.setAttribute('x2', x);
            link.setAttribute('y2', y);
            link.setAttribute('stroke', colors.accent);
            link.setAttribute('stroke-width', 1.5);
            link.setAttribute('stroke-dasharray', '5,3');
            link.style.pointerEvents = 'none'; // Важно для предотвращения зависания
            svg.appendChild(link);
            
            // Анимация линии только если не в модальном окне
            if (!isDetailed) {
                const animateLink = document.createElementNS("http://www.w3.org/2000/svg", "animate");
                animateLink.setAttribute('attributeName', 'stroke-dashoffset');
                animateLink.setAttribute('values', '0;20');
                animateLink.setAttribute('dur', '3s');
                animateLink.setAttribute('repeatCount', 'indefinite');
                link.appendChild(animateLink);
            }
        }
        
        // Соединение с первым блоком для последнего
        if (i === numBlocks - 1) {
            const firstAngle = 0;
            const firstX = centerX + Math.cos(firstAngle) * distance;
            const firstY = centerY + Math.sin(firstAngle) * distance;
            
            const link = document.createElementNS("http://www.w3.org/2000/svg", "line");
            link.setAttribute('x1', x);
            link.setAttribute('y1', y);
            link.setAttribute('x2', firstX);
            link.setAttribute('y2', firstY);
            link.setAttribute('stroke', colors.accent);
            link.setAttribute('stroke-width', 1.5);
            link.setAttribute('stroke-dasharray', '5,3');
            link.style.pointerEvents = 'none'; // Важно для предотвращения зависания
            svg.appendChild(link);
            
            // Анимация линии только если не в модальном окне
            if (!isDetailed) {
                const animateLink = document.createElementNS("http://www.w3.org/2000/svg", "animate");
                animateLink.setAttribute('attributeName', 'stroke-dashoffset');
                animateLink.setAttribute('values', '0;20');
                animateLink.setAttribute('dur', '3s');
                animateLink.setAttribute('repeatCount', 'indefinite');
                link.appendChild(animateLink);
            }
        }
    }
}

/**
 * Создает визуализацию системы умного дома
 * @param {SVGElement} svg SVG-элемент для рисования
 * @param {number} width Ширина
 * @param {number} height Высота
 * @param {boolean} isDetailed Флаг детального представления (в модальном окне)
 * @param {Object} colors Цвета темы
 */
function createSmartHomeVisualization(svg, width, height, isDetailed, colors) {
    // Используем переданные цвета или получаем новые, если не переданы
    colors = colors || getThemeColors();
    
    const devices = [
        { name: 'light', x: 0.3, y: 0.2, icon: '⚡' },
        { name: 'thermo', x: 0.7, y: 0.2, icon: '🌡️' },
        { name: 'camera', x: 0.2, y: 0.6, icon: '📹' },
        { name: 'door', x: 0.5, y: 0.4, icon: '🚪' }
    ];
    
    // Добавляем больше устройств только в неанимированном виде для модальных окон
    if (isDetailed) {
        devices.push({ name: 'music', x: 0.8, y: 0.6, icon: '🔊' });
        devices.push({ name: 'wifi', x: 0.5, y: 0.7, icon: '📶' });
    }
    
    // Дом
    const house = document.createElementNS("http://www.w3.org/2000/svg", "path");
    house.setAttribute('d', `M${width/2},${height*0.15} L${width*0.2},${height*0.4} L${width*0.2},${height*0.8} L${width*0.8},${height*0.8} L${width*0.8},${height*0.4} Z`);
    house.setAttribute('fill', 'none');
    house.setAttribute('stroke', colors.primary);
    house.setAttribute('stroke-width', 2);
    house.style.pointerEvents = 'none'; // Важно для предотвращения зависания
    svg.appendChild(house);
    
    // Центральный узел
    const centerNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    centerNode.setAttribute('cx', width * 0.5);
    centerNode.setAttribute('cy', height * 0.5);
    centerNode.setAttribute('r', Math.min(width, height) * 0.08);
    centerNode.setAttribute('fill', colors.blockFill);
    centerNode.setAttribute('stroke', colors.primary);
    centerNode.setAttribute('stroke-width', 2);
    centerNode.style.pointerEvents = 'none'; // Важно для предотвращения зависания
    svg.appendChild(centerNode);
    
    // Пульсация центрального узла только если не в модальном окне
    if (!isDetailed) {
        const pulseAnimation = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        pulseAnimation.setAttribute('attributeName', 'r');
        pulseAnimation.setAttribute('values', `${Math.min(width, height) * 0.07};${Math.min(width, height) * 0.09};${Math.min(width, height) * 0.07}`);
        pulseAnimation.setAttribute('dur', '3s');
        pulseAnimation.setAttribute('repeatCount', 'indefinite');
        centerNode.appendChild(pulseAnimation);
    }
    
    // Добавление устройств и соединений
    devices.forEach((device, index) => {
        // Устройство
        const deviceNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        deviceNode.setAttribute('cx', width * device.x);
        deviceNode.setAttribute('cy', height * device.y);
        deviceNode.setAttribute('r', Math.min(width, height) * 0.05);
        deviceNode.setAttribute('fill', colors.blockFill);
        deviceNode.setAttribute('stroke', colors.accent);
        deviceNode.setAttribute('stroke-width', 1.5);
        deviceNode.style.pointerEvents = 'none'; // Важно для предотвращения зависания
        svg.appendChild(deviceNode);
        
        // Текст/иконка устройства
        const deviceText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        deviceText.setAttribute('x', width * device.x);
        deviceText.setAttribute('y', height * device.y + 5); // небольшой сдвиг для центрирования
        deviceText.setAttribute('text-anchor', 'middle');
        deviceText.setAttribute('dominant-baseline', 'middle');
        deviceText.setAttribute('fill', colors.text);
        deviceText.setAttribute('font-size', '14px');
        deviceText.textContent = device.icon;
        deviceText.style.pointerEvents = 'none'; // Важно для предотвращения зависания
        svg.appendChild(deviceText);
        
        // Соединение с центральным узлом
        const connection = document.createElementNS("http://www.w3.org/2000/svg", "line");
        connection.setAttribute('x1', width * 0.5);
        connection.setAttribute('y1', height * 0.5);
        connection.setAttribute('x2', width * device.x);
        connection.setAttribute('y2', height * device.y);
        connection.setAttribute('stroke', colors.primary);
        connection.setAttribute('stroke-width', 1);
        connection.setAttribute('stroke-dasharray', '4,2');
        connection.style.pointerEvents = 'none'; // Важно для предотвращения зависания
        svg.appendChild(connection);
        
        // Анимация соединения только если не в модальном окне
        if (!isDetailed) {
            // Анимация соединения - имитация передачи данных
            const dataPacket = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dataPacket.setAttribute('r', 3);
            dataPacket.setAttribute('fill', colors.primary);
            dataPacket.style.pointerEvents = 'none'; // Важно для предотвращения зависания
            svg.appendChild(dataPacket);
            
            // Анимация движения пакета данных
            const animatePacket = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
            animatePacket.setAttribute('path', `M${width * 0.5},${height * 0.5} L${width * device.x},${height * device.y}`);
            animatePacket.setAttribute('dur', `${2 + index * 0.5}s`);
            animatePacket.setAttribute('repeatCount', 'indefinite');
            dataPacket.appendChild(animatePacket);
        }
    });
}

/**
 * Initialize map visualization for contact page
 * @param {string} elementId - The ID of the container element
 */
function initMapVisualization(elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    // Clear previous visualization
    container.innerHTML = '';
    
    // Get theme colors - always get fresh colors when switching themes
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const primaryColor = isDarkTheme ? '#6d8cff' : '#4361ee';
    const backgroundColor = isDarkTheme ? '#2d3748' : '#f7fafc';
    const textColor = isDarkTheme ? '#e2e8f0' : '#2d3748';
    const landColor = isDarkTheme ? '#4a5568' : '#e2e8f0';
    const waterColor = isDarkTheme ? '#1a202c' : '#ebf8ff';
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background", backgroundColor);
    
    // Define projection
    const projection = d3.geoMercator()
        .scale(100)
        .center([-100, 40])
        .translate([width / 2, height / 2]);
    
    // Define path generator
    const path = d3.geoPath()
        .projection(projection);
    
    // Simplified world map data
    const worldData = {
        type: "FeatureCollection",
        features: [
            // North America
            {
                type: "Feature",
                properties: { name: "North America" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-130, 30], [-60, 30], [-60, 70], [-130, 70], [-130, 30]
                    ]]
                }
            },
            // South America
            {
                type: "Feature",
                properties: { name: "South America" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-80, -60], [-35, -60], [-35, 10], [-80, 10], [-80, -60]
                    ]]
                }
            },
            // Europe
            {
                type: "Feature",
                properties: { name: "Europe" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-10, 35], [40, 35], [40, 70], [-10, 70], [-10, 35]
                    ]]
                }
            },
            // Africa
            {
                type: "Feature",
                properties: { name: "Africa" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-20, -40], [50, -40], [50, 35], [-20, 35], [-20, -40]
                    ]]
                }
            },
            // Asia
            {
                type: "Feature",
                properties: { name: "Asia" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [40, 0], [140, 0], [140, 70], [40, 70], [40, 0]
                    ]]
                }
            },
            // Australia
            {
                type: "Feature",
                properties: { name: "Australia" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [110, -45], [155, -45], [155, -10], [110, -10], [110, -45]
                    ]]
                }
            }
        ]
    };
    
    // Draw world map
    svg.selectAll(".country")
        .data(worldData.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", landColor)
        .attr("stroke", isDarkTheme ? "#718096" : "#cbd5e0")
        .attr("stroke-width", 0.5);
    
    // Add company location (Silicon Valley)
    const location = projection([-122, 37.5]);
    
    svg.append("circle")
        .attr("cx", location[0])
        .attr("cy", location[1])
        .attr("r", 8)
        .attr("fill", primaryColor)
        .attr("opacity", 0.8);
    
    svg.append("circle")
        .attr("cx", location[0])
        .attr("cy", location[1])
        .attr("r", 4)
        .attr("fill", primaryColor);
    
    // Add pulsing animation for location
    function pulseAnimation() {
        svg.select("circle")
            .transition()
            .duration(2000)
            .attr("r", 12)
            .attr("opacity", 0.4)
            .transition()
            .duration(2000)
            .attr("r", 8)
            .attr("opacity", 0.8)
            .on("end", pulseAnimation);
    }
    
    pulseAnimation();
    
    // Add location label
    svg.append("text")
        .attr("x", location[0])
        .attr("y", location[1] - 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", isDarkTheme ? "#e2e8f0" : "#2d3748")
        .text("EchoTech HQ");
    
    // Add compass rose
    const compassSize = 40;
    const compassX = width - compassSize - 10;
    const compassY = height - compassSize - 10;
    
    const compass = svg.append("g")
        .attr("transform", `translate(${compassX}, ${compassY})`);
    
    compass.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", compassSize)
        .attr("fill", "rgba(255,255,255,0.1)")
        .attr("stroke", isDarkTheme ? "#718096" : "#a0aec0")
        .attr("stroke-width", 1);
    
    ["N", "E", "S", "W"].forEach((dir, i) => {
        const angle = i * 90;
        const radians = (angle - 90) * (Math.PI / 180);
        const x = Math.cos(radians) * (compassSize - 15);
        const y = Math.sin(radians) * (compassSize - 15);
        
        compass.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", "10px")
            .attr("font-weight", "bold")
            .attr("fill", isDarkTheme ? "#e2e8f0" : "#2d3748")
            .text(dir);
    });
    
    // Add lines for directions
    for (let i = 0; i < 360; i += 45) {
        const radians = (i - 90) * (Math.PI / 180);
        const x1 = Math.cos(radians) * (compassSize - 5);
        const y1 = Math.sin(radians) * (compassSize - 5);
        const x2 = Math.cos(radians) * compassSize;
        const y2 = Math.sin(radians) * compassSize;
        
        compass.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", i % 90 === 0 ? primaryColor : isDarkTheme ? "#718096" : "#a0aec0")
            .attr("stroke-width", i % 90 === 0 ? 2 : 1);
    }
}

/**
 * Convert hex color to RGB string
 * @param {string} hex - Hex color string
 * @returns {string} RGB values as comma-separated string
 */
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return r + ',' + g + ',' + b;
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
