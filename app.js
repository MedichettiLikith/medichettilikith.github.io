// Global Variables
let statsChart = null;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTabs();
    initChart();
    initFilters();
    initSearch();
    initContactForm();
});

// ================= THEME TOGGLE LOGIC =================
function initTheme() {
    const mainThemeCheckbox = document.getElementById('checkbox');
    const sidebarThemeBtn = document.getElementById('sidebarThemeToggle');
    const body = document.body;

    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Synchronize toggle switch state
    if (mainThemeCheckbox) {
        mainThemeCheckbox.checked = (savedTheme === 'dark');
        
        mainThemeCheckbox.addEventListener('change', () => {
            const nextTheme = mainThemeCheckbox.checked ? 'dark' : 'light';
            setTheme(nextTheme);
        });
    }

    if (sidebarThemeBtn) {
        sidebarThemeBtn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
            if (mainThemeCheckbox) {
                mainThemeCheckbox.checked = (nextTheme === 'dark');
            }
        });
    }
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update chart colors if chart exists
    if (statsChart) {
        updateChartColors(theme);
    }
}

// ================= TAB NAVIGATION SYSTEM =================
function initTabs() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const profilePill = document.getElementById('profilePill');

    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    if (profilePill) {
        profilePill.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = profilePill.getAttribute('data-tab');
            switchTab(tabId);
        });
    }

    // Trigger skills bar animation if starting on skills tab
    if (document.getElementById('skills').classList.contains('active')) {
        animateSkillBars();
    }
}

function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    // Deactivate all tabs
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all sidebar items
    sidebarItems.forEach(item => {
        item.classList.remove('active');
    });

    // Activate selected tab content
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
        
        // Scroll to top of the dashboard main body smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Trigger animations based on active tab
        if (tabId === 'skills') {
            setTimeout(animateSkillBars, 100);
        } else {
            resetSkillBars();
        }
    }

    // Activate selected sidebar item
    const activeItem = document.querySelector(`.sidebar-item[data-tab="${tabId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Animate progress bars in skills tab
function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    fills.forEach(fill => {
        const level = fill.getAttribute('data-level');
        fill.style.width = level;
    });
}

function resetSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    fills.forEach(fill => {
        fill.style.width = '0';
    });
}

// ================= CHART.JS LIVE CHART =================
function initChart() {
    const ctx = document.getElementById('statisticsChart');
    if (!ctx) return;

    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const isDark = (currentTheme === 'dark');

    // Mock Datasets
    const learningHoursData = {
        labels: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        values: [0, 1.5, 2.5, 1, 4, 3, 2], // Exactly matching attached mockup hours
        prefix: 'h',
        label: 'Learning Hours'
    };

    const projectMilestonesData = {
        labels: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        values: [1, 2, 2, 4, 3, 5, 4],
        prefix: ' commits',
        label: 'Project Commits'
    };

    let activeDataset = learningHoursData;

    // Custom styling configurations based on theme
    const getColors = (dark) => ({
        lineColor: dark ? '#ffffff' : '#0b0b0b',
        gridColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        textColor: dark ? '#a0a0a0' : '#6e6e6e',
        pointBg: dark ? '#161616' : '#ffffff',
        pointBorder: dark ? '#ffffff' : '#0b0b0b',
        tooltipBg: dark ? '#ffffff' : '#0b0b0b',
        tooltipText: dark ? '#070707' : '#ffffff'
    });

    const colors = getColors(isDark);

    statsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: activeDataset.labels,
            datasets: [{
                label: activeDataset.label,
                data: activeDataset.values,
                borderColor: colors.lineColor,
                borderWidth: 3,
                tension: 0.4,
                fill: false,
                pointBackgroundColor: colors.pointBg,
                pointBorderColor: colors.pointBorder,
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBorderWidth: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // We use our own interactive titles
                },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipText,
                    bodyColor: colors.tooltipText,
                    cornerRadius: 8,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.raw + activeDataset.prefix;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: colors.textColor,
                        font: {
                            family: 'Outfit',
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                y: {
                    min: 0,
                    max: 5,
                    grid: {
                        color: colors.gridColor
                    },
                    ticks: {
                        stepSize: 1,
                        color: colors.textColor,
                        font: {
                            family: 'Outfit',
                            size: 11,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });

    // Handle dataset toggling between "Learning Commits" and "Project Milestones"
    const learnHoursTab = document.getElementById('learnHoursTab');
    const myCoursesTab = document.getElementById('myCoursesTab');

    if (learnHoursTab && myCoursesTab) {
        learnHoursTab.addEventListener('click', () => {
            learnHoursTab.classList.add('active');
            myCoursesTab.classList.remove('active');
            activeDataset = learningHoursData;
            statsChart.data.datasets[0].data = activeDataset.values;
            statsChart.data.datasets[0].label = activeDataset.label;
            statsChart.update();
        });

        myCoursesTab.addEventListener('click', () => {
            myCoursesTab.classList.add('active');
            learnHoursTab.classList.remove('active');
            activeDataset = projectMilestonesData;
            statsChart.data.datasets[0].data = activeDataset.values;
            statsChart.data.datasets[0].label = activeDataset.label;
            statsChart.update();
        });
    }

    // Handle Timeframe changes (Weekly vs Monthly mock scaling)
    const timeframeSelect = document.getElementById('timeframeSelect');
    if (timeframeSelect) {
        timeframeSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'monthly') {
                statsChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
                if (activeDataset === learningHoursData) {
                    statsChart.data.datasets[0].data = [35, 42, 50, 28, 62, 55, 48];
                    activeDataset.prefix = 'h';
                } else {
                    statsChart.data.datasets[0].data = [60, 80, 75, 95, 110, 85, 90];
                    activeDataset.prefix = ' commits';
                }
                statsChart.options.scales.y.max = 120;
                statsChart.options.scales.y.ticks.stepSize = 20;
            } else {
                statsChart.data.labels = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                statsChart.data.datasets[0].data = activeDataset.values;
                statsChart.options.scales.y.max = 5;
                statsChart.options.scales.y.ticks.stepSize = 1;
                activeDataset.prefix = activeDataset === learningHoursData ? 'h' : ' commits';
            }
            statsChart.update();
        });
    }
}

function updateChartColors(theme) {
    const isDark = (theme === 'dark');
    
    // Core color references
    const lineColor = isDark ? '#ffffff' : '#0b0b0b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
    const textColor = isDark ? '#a0a0a0' : '#6e6e6e';
    const pointBg = isDark ? '#161616' : '#ffffff';
    const pointBorder = isDark ? '#ffffff' : '#0b0b0b';
    const tooltipBg = isDark ? '#ffffff' : '#0b0b0b';
    const tooltipText = isDark ? '#070707' : '#ffffff';

    // Update dataset styles
    statsChart.data.datasets[0].borderColor = lineColor;
    statsChart.data.datasets[0].pointBackgroundColor = pointBg;
    statsChart.data.datasets[0].pointBorderColor = pointBorder;

    // Update scale styles
    statsChart.options.scales.x.ticks.color = textColor;
    statsChart.options.scales.y.ticks.color = textColor;
    statsChart.options.scales.y.grid.color = gridColor;

    // Update tooltip styles
    statsChart.options.plugins.tooltip.backgroundColor = tooltipBg;
    statsChart.options.plugins.tooltip.titleColor = tooltipText;
    statsChart.options.plugins.tooltip.bodyColor = tooltipText;

    statsChart.update();
}

// ================= CERTIFICATE FILTERING =================
function initFilters() {
    const filterPills = document.querySelectorAll('#certFilters .filter-pill');
    const certCards = document.querySelectorAll('#certGrid .certificate-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active from all
            filterPills.forEach(p => p.classList.remove('active'));
            // Add active to current
            pill.classList.add('active');

            const filterVal = pill.getAttribute('data-filter');

            certCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (filterVal === 'all' || cardCat === filterVal) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ================= DASHBOARD SMART SEARCH =================
function initSearch() {
    const searchInput = document.getElementById('dashboardSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        // Get currently active tab to optimize local search
        const activeTab = document.querySelector('.tab-content.active');
        const activeTabId = activeTab ? activeTab.getAttribute('id') : '';

        if (activeTabId === 'certificates') {
            // Search inside certificates
            const cards = document.querySelectorAll('#certGrid .certificate-card');
            cards.forEach(card => {
                const title = card.querySelector('.certificate-title').textContent.toLowerCase();
                const issuer = card.querySelector('.certificate-issuer').textContent.toLowerCase();
                if (title.includes(query) || issuer.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        } else if (activeTabId === 'skills') {
            // Search inside skills list
            const skillItems = document.querySelectorAll('.skill-progress-item');
            skillItems.forEach(item => {
                const name = item.querySelector('.skill-name-row span:first-child').textContent.toLowerCase();
                if (name.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        } else {
            // Default global search helper: If queries match main tabs names, let them switch tabs!
            const tabNames = ['overview', 'skills', 'education', 'experience', 'certificates', 'contact'];
            const matchedTab = tabNames.find(t => t.includes(query) && query.length >= 3);
            if (matchedTab) {
                switchTab(matchedTab);
            }
        }
    });
}

// ================= DIRECT CONTACT & CLIPBOARD COPY =================
function copyText(textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied text: ${textToCopy}`);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ================= CONTACT FORM VALIDATION =================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const subject = document.getElementById('formSubject').value;
        const message = document.getElementById('formMessage').value;

        // Perform mock animation for sending
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        setTimeout(() => {
            showToast('Message Sent Successfully!');
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
            form.reset();
        }, 1500);
    });
}
