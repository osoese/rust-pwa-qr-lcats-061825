// Modern ES6+ JavaScript
console.log('🧠 Subconscience Mind PWA loaded');

// API testing functionality
async function testApiConnection() {
    try {
        const response = await fetch('/api/hello');
        const data = await response.json();
        
        alert(`✅ API Connected: ${data}`);
        console.log('API Response:', data);
    } catch (error) {
        alert(`❌ API Error: ${error.message}`);
        console.error('API Error:', error);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.getElementById('test-api');
    if (testButton) {
        testButton.addEventListener('click', testApiConnection);
    }
    
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
});

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
