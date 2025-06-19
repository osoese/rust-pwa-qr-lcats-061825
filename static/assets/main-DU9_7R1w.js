(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function s(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=s(r);fetch(r.href,a)}})();console.log("✨ Super Conscious Lifestyle Management System loaded");class i extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const e=this.getAttribute("title")||"Lifestyle Area",s=this.getAttribute("description")||"Enhance your conscious living";this.shadowRoot.innerHTML=`
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
                <h3>${e}</h3>
                <p>${s}</p>
            </div>
        `,this.shadowRoot.querySelector(".card").addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("lifestyle-card-click",{detail:{title:e,description:s},bubbles:!0}))})}}customElements.define("lifestyle-card",i);class c extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const e=this.getAttribute("type")||"default",s=this.getAttribute("label")||"Button";this.shadowRoot.innerHTML=`
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
            <button class="system-btn ${e}">${s}</button>
        `,this.shadowRoot.querySelector(".system-btn").addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("system-button-click",{detail:{type:e,label:s},bubbles:!0}))})}}class d extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.messages=[]}connectedCallback(){this.shadowRoot.innerHTML=`
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
                    height: 300px;
                    display: flex;
                    flex-direction: column;
                }
                
                .stream-header {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border, #334155);
                    background: linear-gradient(135deg, #8b5cf6, #06b6d4);
                    color: white;
                    font-weight: 600;
                }
                
                .stream-content {
                    flex: 1;
                    padding: 1rem;
                    overflow-y: auto;
                    background: #0f172a;
                }
                
                .stream-status {
                    padding: 0.5rem 1rem;
                    background: var(--surface-variant, #334155);
                    color: var(--text-muted, #94a3b8);
                    font-size: 0.875rem;
                    border-top: 1px solid var(--border, #334155);
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
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
            <div class="stream-container">
                <div class="stream-header">
                    ✨ Consciousness Stream
                </div>
                <div class="stream-content" id="streamContent">
                    <div style="color: #94a3b8; text-align: center; margin-top: 2rem;">
                        Stream ready... Awaiting consciousness data...
                    </div>
                </div>
                <div class="stream-status">
                    <span class="status-dot"></span>
                    Stream active - Ready to receive
                </div>
            </div>
        `}addMessage(e){this.messages.push(e);const s=this.shadowRoot.getElementById("streamContent"),o=document.createElement("div");o.style.cssText=`
            color: #e2e8f0;
            margin-bottom: 0.5rem;
            padding: 0.5rem;
            border-left: 3px solid #8b5cf6;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 4px;
        `,o.textContent=`${new Date().toLocaleTimeString()}: ${e}`,s.appendChild(o),s.scrollTop=s.scrollHeight}}class l extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.shadowRoot.innerHTML=`
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
        `}showMessage(e){const s=this.shadowRoot.getElementById("messageContent"),o=this.shadowRoot.getElementById("messageTime");s.textContent=e,o.textContent=new Date().toLocaleString(),this.style.animation="none",setTimeout(()=>{this.style.animation="fadeIn 0.5s ease"},10)}}customElements.define("system-button",c);customElements.define("stream-element",d);customElements.define("message-display",l);async function m(){try{const e=await(await fetch("/api/hello")).json();alert(`✅ System Connected: ${e}`),console.log("System Response:",e)}catch(t){alert(`❌ System Error: ${t.message}`),console.error("System Error:",t)}}function u(){const t=document.createElement("lifestyle-card");t.setAttribute("title","Consciousness Stream"),t.setAttribute("description","Real-time consciousness data stream");const e=document.querySelector(".features");e&&(e.appendChild(t),setTimeout(()=>{const s=t.shadowRoot.querySelector(".card");if(s){const o=document.createElement("stream-element"),r=document.createElement("message-display");s.innerHTML=`
                    <h3>Consciousness Stream</h3>
                    <div style="margin: 1rem 0;"></div>
                `,s.appendChild(o),s.appendChild(r),g(o,r)}},100))}function g(t,e){const s=["Consciousness level: Elevated","Energy frequency: High vibration detected","Mindfulness state: Active awareness","Spiritual alignment: Centered","Life force energy: Optimal flow"];let o=0;setTimeout(()=>{e.showMessage("Stream connection established. Monitoring consciousness...")},1e3);const r=setInterval(()=>{const a=s[o%s.length];t.addMessage(a),Math.random()>.7&&e.showMessage(`System update: ${a}`),o++,o>=10&&(clearInterval(r),t.addMessage("Demo stream completed. Real-time integration ready."))},3e3)}document.addEventListener("DOMContentLoaded",()=>{document.addEventListener("system-button-click",t=>{const{type:e,label:s}=t.detail;console.log(`System button clicked: ${e} - ${s}`),e==="connectivity"?m():e==="stream"&&u()}),document.addEventListener("lifestyle-card-click",t=>{const{title:e,description:s}=t.detail;console.log(`Lifestyle area selected: ${e}`)}),"serviceWorker"in navigator&&navigator.serviceWorker.register("/service-worker.js").then(t=>{console.log("✅ Service Worker registered:",t)}).catch(t=>{console.log("❌ Service Worker registration failed:",t)}),p()});function p(){console.log("🧘 Consciousness tracker initialized")}
