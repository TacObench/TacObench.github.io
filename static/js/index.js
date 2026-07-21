window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

})

// ============================================================
// Policy Rollouts — sensor tab switching (scoped per task block)
// ============================================================
function initRolloutTabs() {
    var tasks = document.querySelectorAll('.rollout-task');
    tasks.forEach(function(task) {
        var tabs = task.querySelectorAll('.rollout-tab');
        var panels = task.querySelectorAll('.rollout-panel');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var targetId = tab.getAttribute('data-target');
                tabs.forEach(function(t) { t.classList.remove('is-active'); });
                panels.forEach(function(p) {
                    if (p.id === targetId) {
                        p.classList.add('is-active');
                    } else {
                        p.classList.remove('is-active');
                        // pause any playing video in the hidden panel
                        p.querySelectorAll('video').forEach(function(v) {
                            if (!v.paused) { v.pause(); }
                        });
                    }
                });
                tab.classList.add('is-active');
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', initRolloutTabs);

// ============================================================
// Interactive Bar Charts for Experiment Results
// ============================================================
function initResultCharts() {
    // Color scheme based on sensor modalities (increased contrast between light/dark)
    const sensorColors = {
        'FSR': { light: '#FFB84D', dark: '#E68A00' },
        'FlexiTac': { light: '#FFEB66', dark: '#F5C400' },
        'eGain': { light: '#FCF55F', dark: '#C9C230' },
        'Contact Mic': { light: '#D4EFCB', dark: '#98C789' },
        'Daimon': { light: '#EFCECA', dark: '#D57E73' },
        'eFlesh': { light: '#C9E2F0', dark: '#7BACC7' }
    };

    const taskColors = {
        'Pick-and-Place': { light: '#D4EFCB', dark: '#98C789' },
        'Insertion': { light: '#EFCECA', dark: '#D57E73' },
        'Reorientation': { light: '#C9E2F0', dark: '#7BACC7' }
    };

    // Common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.2,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 13,
                        weight: 600
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                    generateLabels: function(chart) {
                        const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                        // Make legend items grayscale
                        original.forEach((label, index) => {
                            if (index === 0) {
                                // Vision Only - light gray
                                label.fillStyle = '#c5c5c5';
                                label.strokeStyle = '#999999';
                            } else {
                                // Vision + Tactile - dark gray
                                label.fillStyle = '#666666';
                                label.strokeStyle = '#666666';
                            }
                        });
                        return original;
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 29, 20, 0.9)',
                titleFont: {
                    family: "'Inter', sans-serif",
                    size: 13,
                    weight: 700
                },
                bodyFont: {
                    family: "'Inter', sans-serif",
                    size: 12
                },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.parsed.y.toFixed(2);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 1.0,
                ticks: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    },
                    callback: function(value) {
                        return value.toFixed(1);
                    }
                },
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)'
                },
                title: {
                    display: true,
                    text: 'Success Rate',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 13,
                        weight: 600
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                        weight: 600
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    };

    // Pick-and-Place Chart
    const pnpCtx = document.getElementById('pickAndPlaceChart');
    if (pnpCtx) {
        const sensors = ['FSR', 'FlexiTac', 'eGain', 'Contact Mic', 'Daimon', 'eFlesh'];
        const visionData = [0.50, 0.75, 0.50, 0.65, 0.95, 0.85];
        const tactileData = [0.50, 0.85, 0.75, 0.90, 0.80, 0.90];

        new Chart(pnpCtx, {
            type: 'bar',
            data: {
                labels: sensors,
                datasets: [
                    {
                        label: 'Vision Only',
                        data: visionData,
                        backgroundColor: sensors.map(s => sensorColors[s].light),
                        borderColor: sensors.map(s => sensorColors[s].dark),
                        borderWidth: 2,
                        borderRadius: 6
                    },
                    {
                        label: 'Vision + Tactile',
                        data: tactileData,
                        backgroundColor: sensors.map(s => sensorColors[s].dark),
                        borderColor: sensors.map(s => sensorColors[s].dark),
                        borderWidth: 2,
                        borderRadius: 6
                    }
                ]
            },
            options: commonOptions
        });
    }

    // Insertion Chart
    const insertCtx = document.getElementById('insertionChart');
    if (insertCtx) {
        const sensors = ['FlexiTac', 'Contact Mic', 'eFlesh'];
        const visionData = [0.1, 0.2, 0.3];
        const tactileData = [0.3, 0.7, 0.7];

        new Chart(insertCtx, {
            type: 'bar',
            data: {
                labels: sensors,
                datasets: [
                    {
                        label: 'Vision Only',
                        data: visionData,
                        backgroundColor: sensors.map(s => sensorColors[s].light),
                        borderColor: sensors.map(s => sensorColors[s].dark),
                        borderWidth: 2,
                        borderRadius: 6
                    },
                    {
                        label: 'Vision + Tactile',
                        data: tactileData,
                        backgroundColor: sensors.map(s => sensorColors[s].dark),
                        borderColor: sensors.map(s => sensorColors[s].dark),
                        borderWidth: 2,
                        borderRadius: 6
                    }
                ]
            },
            options: commonOptions
        });
    }

    // Reorientation Chart
    const reorientCtx = document.getElementById('reorientationChart');
    if (reorientCtx) {
        const sensors = ['FSR', 'Daimon', 'eFlesh'];
        const visionData = [0.6, 0.2, 0.5];
        const tactileData = [0.8, 0.7, 0.8];

        new Chart(reorientCtx, {
            type: 'bar',
            data: {
                labels: sensors,
                datasets: [
                    {
                        label: 'Vision Only',
                        data: visionData,
                        backgroundColor: sensors.map(s => sensorColors[s].light),
                        borderColor: sensors.map(s => sensorColors[s].dark),
                        borderWidth: 2,
                        borderRadius: 6
                    },
                    {
                        label: 'Vision + Tactile',
                        data: tactileData,
                        backgroundColor: sensors.map(s => sensorColors[s].dark),
                        borderColor: sensors.map(s => sensorColors[s].dark),
                        borderWidth: 2,
                        borderRadius: 6
                    }
                ]
            },
            options: commonOptions
        });
    }

    // Material Type Chart
    const materialCtx = document.getElementById('materialChart');
    if (materialCtx) {
        const tasks = ['Pick-and-Place', 'Insertion', 'Reorientation'];
        const lowFrictionData = [0.625, 0.1, 0.6];
        const highFrictionData = [0.81, 0.25, 0.35];

        new Chart(materialCtx, {
            type: 'bar',
            data: {
                labels: tasks,
                datasets: [
                    {
                        label: 'Low Friction',
                        data: lowFrictionData,
                        backgroundColor: tasks.map(t => taskColors[t].light),
                        borderColor: tasks.map(t => taskColors[t].dark),
                        borderWidth: 2,
                        borderRadius: 6
                    },
                    {
                        label: 'High Friction',
                        data: highFrictionData,
                        backgroundColor: tasks.map(t => taskColors[t].dark),
                        borderColor: tasks.map(t => taskColors[t].dark),
                        borderWidth: 2,
                        borderRadius: 6
                    }
                ]
            },
            options: commonOptions
        });
    }
}

// Initialize charts after DOM is loaded and Chart.js is available
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a brief moment to ensure Chart.js is loaded
        setTimeout(initResultCharts, 100);
    });
} else {
    setTimeout(initResultCharts, 100);
}
