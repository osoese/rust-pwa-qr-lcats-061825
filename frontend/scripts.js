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

// System Button Web Component
class SystemButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        const type = this.getAttribute('type') || 'default';
        const label = this.getAttribute('label') || 'Button';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    margin: 0.5rem;
                }
                
                .system-btn {
                    background: var(--primary-color, #6366f1);
                    color: white;
                    border: none;
                    border-radius: var(--radius, 8px);
                    padding: 1rem 2rem;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .system-btn:hover {
                    background: var(--primary-hover, #4f46e5);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                }
                
                .system-btn.stream {
                    background: linear-gradient(135deg, #8b5cf6, #06b6d4);
                }
                
                .system-btn.stream:hover {
                    background: linear-gradient(135deg, #7c3aed, #0891b2);
                }
            </style>
            <button class="system-btn ${type}">${label}</button>
        `;
        
        this.shadowRoot.querySelector('.system-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('system-button-click', {
                detail: { type, label },
                bubbles: true
            }));
        });
    }
}

// Stream Element Web Component with Camera and QR Detection
class StreamElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.messages = [];
        this.videoStream = null;
        this.canvas = null;
        this.context = null;
        this.isScanning = false;
    }
    
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                
                .stream-container {
                    background: var(--surface, #1e293b);
                    border: 1px solid var(--border, #334155);
                    border-radius: var(--radius, 8px);
                    height: 400px;
                    display: flex;
                    flex-direction: column;
                }
                
                .stream-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border, #334155);
                    background: linear-gradient(135deg, #8b5cf6, #06b6d4);
                    color: white;
                    font-weight: 600;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .stream-controls {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .control-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.875rem;
                }
                
                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                .video-section {
                    position: relative;
                    height: 200px;
                    background: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #cameraVideo {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .qr-overlay {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 0.5rem;
                    border-radius: 4px;
                    font-size: 0.875rem;
                }
                
                .chat-section {
                    flex: 1;
                    padding: 1rem;
                    overflow-y: auto;
                    background: #0f172a;
                }
                
                .chat-message {
                    color: #e2e8f0;
                    margin-bottom: 0.5rem;
                    padding: 0.5rem;
                    border-left: 3px solid #8b5cf6;
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: 4px;
                    font-size: 0.875rem;
                }
                
                .stream-status {
                    padding: 0.5rem 1rem;
                    background: var(--surface-variant, #334155);
                    color: var(--text-muted, #94a3b8);
                    font-size: 0.875rem;
                    border-top: 1px solid var(--border, #334155);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .status-dot {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    margin-right: 0.5rem;
                    animation: pulse 2s infinite;
                }
                
                .status-dot.scanning {
                    background: #f59e0b;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
            <div class="stream-container">
                <div class="stream-header">
                    <span>📹 Camera Stream & QR Scanner</span>
                    <div class="stream-controls">
                        <button class="control-btn" id="startCamera">Start Camera</button>
                        <button class="control-btn" id="stopCamera">Stop Camera</button>
                    </div>
                </div>
                <div class="video-section">
                    <video id="cameraVideo" autoplay muted></video>
                    <div class="qr-overlay" id="qrOverlay" style="display: none;">
                        QR Scanner Active
                    </div>
                </div>
                <div class="chat-section" id="chatSection">
                    <div class="chat-message">
                        🤖 System: Ready to receive messages and scan QR codes...
                    </div>
                </div>
                <div class="stream-status">
                    <span><span class="status-dot" id="statusDot"></span><span id="statusText">Camera stopped</span></span>
                    <span id="qrStatus">QR Scanner: Inactive</span>
                </div>
            </div>
        `;
        
        this.setupCamera();
        this.initializeChatReady();
    }
    
    async setupCamera() {
        const startBtn = this.shadowRoot.getElementById('startCamera');
        const stopBtn = this.shadowRoot.getElementById('stopCamera');
        const video = this.shadowRoot.getElementById('cameraVideo');
        const statusDot = this.shadowRoot.getElementById('statusDot');
        const statusText = this.shadowRoot.getElementById('statusText');
        const qrOverlay = this.shadowRoot.getElementById('qrOverlay');
        const qrStatus = this.shadowRoot.getElementById('qrStatus');
        
        startBtn.addEventListener('click', async () => {
            try {
                this.videoStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } // Use back camera if available
                });
                video.srcObject = this.videoStream;
                
                statusDot.style.background = '#10b981';
                statusText.textContent = 'Camera active';
                qrOverlay.style.display = 'block';
                qrStatus.textContent = 'QR Scanner: Active';
                statusDot.classList.add('scanning');
                
                this.addMessage('📹 Camera started - QR scanning active');
                this.startQRScanning();
                
            } catch (error) {
                this.addMessage(`❌ Camera error: ${error.message}`);
                console.error('Camera access error:', error);
            }
        });
        
        stopBtn.addEventListener('click', () => {
            this.stopCamera();
        });
    }
    
    stopCamera() {
        if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => track.stop());
            this.videoStream = null;
        }
        
        const video = this.shadowRoot.getElementById('cameraVideo');
        const statusDot = this.shadowRoot.getElementById('statusDot');
        const statusText = this.shadowRoot.getElementById('statusText');
        const qrOverlay = this.shadowRoot.getElementById('qrOverlay');
        const qrStatus = this.shadowRoot.getElementById('qrStatus');
        
        video.srcObject = null;
        statusDot.style.background = '#ef4444';
        statusText.textContent = 'Camera stopped';
        qrOverlay.style.display = 'none';
        qrStatus.textContent = 'QR Scanner: Inactive';
        statusDot.classList.remove('scanning');
        
        this.isScanning = false;
        this.addMessage('📹 Camera stopped');
    }
    
    startQRScanning() {
        this.isScanning = true;
        this.scanForQR();
    }
    
    scanForQR() {
        if (!this.isScanning || !this.videoStream) return;
        
        const video = this.shadowRoot.getElementById('cameraVideo');
        
        // Create canvas for frame capture
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
        }
        
        // Set canvas size to match video
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        this.context.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Get image data for QR scanning
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // Simple QR detection simulation (in real app, use a QR library like jsQR)
        this.simulateQRDetection(imageData);
        
        // Continue scanning
        setTimeout(() => this.scanForQR(), 500); // Scan every 500ms
    }
    
    simulateQRDetection(imageData) {
        // This is a simulation - in real implementation, use jsQR library
        // For demo purposes, we'll randomly detect a QR code
        if (Math.random() > 0.98) { // 2% chance per scan
            const mockQRContent = `Mock QR Code: ${Date.now()}`;
            this.handleQRDetection(mockQRContent);
        }
    }
    
    async handleQRDetection(qrContent) {
        this.addMessage(`🔍 QR Code detected: ${qrContent}`);
        
        // Send QR content to Rust backend
        try {
            const response = await fetch('/api/chat/qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: qrContent })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.addMessage(`📡 Server response: ${result.message}`);
            } else {
                this.addMessage('❌ Failed to send QR data to server');
            }
        } catch (error) {
            this.addMessage(`❌ Network error: ${error.message}`);
        }
    }
    
    async initializeChatReady() {
        try {
            const response = await fetch('/api/chat/ready');
            if (response.ok) {
                const data = await response.json();
                this.addMessage(`📡 ${data.message}`);
            }
        } catch (error) {
            this.addMessage('❌ Failed to connect to chat system');
        }
    }
    
    addMessage(message) {
        this.messages.push(message);
        const chatSection = this.shadowRoot.getElementById('chatSection');
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        messageEl.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
        chatSection.appendChild(messageEl);
        chatSection.scrollTop = chatSection.scrollHeight;
    }
    
    disconnectedCallback() {
        this.stopCamera();
    }
}

// Message Display Web Component
class MessageDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 1rem 0;
                }
                
                .message-container {
                    background: var(--surface, #1e293b);
                    border: 1px solid var(--border, #334155);
                    border-radius: var(--radius, 8px);
                    padding: 1rem;
                }
                
                .message-header {
                    color: var(--primary-color, #6366f1);
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .message-content {
                    color: var(--text, #e2e8f0);
                    line-height: 1.6;
                }
                
                .message-time {
                    color: var(--text-muted, #94a3b8);
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                }
            </style>
            <div class="message-container">
                <div class="message-header">
                    <span>📡</span>
                    <span>Server Message</span>
                </div>
                <div class="message-content" id="messageContent">
                    Waiting for server messages...
                </div>
                <div class="message-time" id="messageTime">
                    Ready
                </div>
            </div>
        `;
    }
    
    showMessage(message) {
        const content = this.shadowRoot.getElementById('messageContent');
        const time = this.shadowRoot.getElementById('messageTime');
        
        content.textContent = message;
        time.textContent = new Date().toLocaleString();
        
        // Add a subtle animation
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }
}

// Register new web components
customElements.define('system-button', SystemButton);
customElements.define('stream-element', StreamElement);
customElements.define('message-display', MessageDisplay);

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

// Stream functionality
function openStreamCard() {
    // Create a new lifestyle card for the stream
    const streamCard = document.createElement('lifestyle-card');
    streamCard.setAttribute('title', 'Consciousness Stream');
    streamCard.setAttribute('description', 'Real-time consciousness data stream');
    
    // Find the features section and add the stream card
    const featuresSection = document.querySelector('.features');
    if (featuresSection) {
        featuresSection.appendChild(streamCard);
        
        // Add custom content to the stream card after it's connected
        setTimeout(() => {
            const cardElement = streamCard.shadowRoot.querySelector('.card');
            if (cardElement) {
                // Replace the description with stream and message components
                const streamElement = document.createElement('stream-element');
                const messageDisplay = document.createElement('message-display');
                
                cardElement.innerHTML = `
                    <h3>Consciousness Stream</h3>
                    <div style="margin: 1rem 0;"></div>
                `;
                
                cardElement.appendChild(streamElement);
                cardElement.appendChild(messageDisplay);
                
                // Start sending demo messages
                startDemoStream(streamElement, messageDisplay);
            }
        }, 100);
    }
}

// Demo stream functionality
function startDemoStream(streamElement, messageDisplay) {
    const demoMessages = [
        "Consciousness level: Elevated",
        "Energy frequency: High vibration detected",
        "Mindfulness state: Active awareness",
        "Spiritual alignment: Centered",
        "Life force energy: Optimal flow"
    ];
    
    let messageIndex = 0;
    
    // Send initial message
    setTimeout(() => {
        messageDisplay.showMessage("Stream connection established. Monitoring consciousness...");
    }, 1000);
    
    // Send periodic stream messages
    const interval = setInterval(() => {
        const message = demoMessages[messageIndex % demoMessages.length];
        streamElement.addMessage(message);
        
        // Occasionally send server messages
        if (Math.random() > 0.7) {
            messageDisplay.showMessage(`System update: ${message}`);
        }
        
        messageIndex++;
        
        // Stop after 10 messages (demo)
        if (messageIndex >= 10) {
            clearInterval(interval);
            streamElement.addMessage("Demo stream completed. Real-time integration ready.");
        }
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Listen for system button clicks
    document.addEventListener('system-button-click', (event) => {
        const { type, label } = event.detail;
        console.log(`System button clicked: ${type} - ${label}`);
        
        if (type === 'connectivity') {
            testApiConnection();
        } else if (type === 'stream') {
            openStreamCard();
        }
    });
    
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
