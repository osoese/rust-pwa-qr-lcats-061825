// Modern ES6+ JavaScript for Super Conscious Lifestyle Management
console.log('✨ Super Conscious Lifestyle Management System loaded');

// Lifestyle Card Web Component
class LifestyleCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        const title = this.getAttribute('title') || 'Lifestyle Area';
        const description = this.getAttribute('description') || 'Enhance your conscious living';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 1rem;
                }
                
                .card {
                    background: var(--surface, #1e293b);
                    border: 1px solid var(--border, #334155);
                    border-radius: var(--radius, 8px);
                    padding: 2rem;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                    height: 100%;
                }
                
                .card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
                }
                
                .card h3 {
                    color: var(--primary-color, #6366f1);
                    margin-bottom: 1rem;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .card p {
                    color: var(--text-muted, #94a3b8);
                    line-height: 1.6;
                }
                
                .card::before {
                    content: '✨';
                    font-size: 2rem;
                    display: block;
                    margin-bottom: 1rem;
                }
            </style>
            <div class="card">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;
        
        // Add click event for future expansion
        this.shadowRoot.querySelector('.card').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('lifestyle-card-click', {
                detail: { title, description },
                bubbles: true
            }));
        });
    }
}

// Register the web component
customElements.define('lifestyle-card', LifestyleCard);

// API testing functionality
async function testApiConnection() {
    try {
        const response = await fetch('/api/hello');
        const data = await response.json();
        
        alert(`✅ System Connected: ${data}`);
        console.log('System Response:', data);
    } catch (error) {
        alert(`❌ System Error: ${error.message}`);
        console.error('System Error:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.getElementById('test-api');
    if (testButton) {
        testButton.addEventListener('click', testApiConnection);
    }
    
    // Listen for lifestyle card clicks
    document.addEventListener('lifestyle-card-click', (event) => {
        const { title, description } = event.detail;
        console.log(`Lifestyle area selected: ${title}`);
        // Future: Navigate to specific lifestyle management section
    });
    
    // Service Worker registration for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    }
    
    // Initialize consciousness tracker (future enhancement)
    initializeConsciousnessTracker();
});

// Consciousness tracking functionality (placeholder for future development)
function initializeConsciousnessTracker() {
    console.log('🧘 Consciousness tracker initialized');
    // Future: Implement mindfulness prompts, energy level tracking, etc.
}

// Utility functions
const utils = {
    // Debounce function for search/input
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Format date helper
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    // Local storage wrapper
    storage: {
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch {
                return null;
            }
        },
        remove(key) {
            localStorage.removeItem(key);
        }
    }
};

// Export for use in other modules
export { utils, testApiConnection };
