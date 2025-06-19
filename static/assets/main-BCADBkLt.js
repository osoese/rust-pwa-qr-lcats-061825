(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function s(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(t){if(t.ep)return;t.ep=!0;const r=s(t);fetch(t.href,r)}})();console.log("✨ Super Conscious Lifestyle Management System loaded");class c extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){const e=this.getAttribute("title")||"Lifestyle Area",s=this.getAttribute("description")||"Enhance your conscious living";this.shadowRoot.innerHTML=`
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
        `,this.shadowRoot.querySelector(".card").addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("lifestyle-card-click",{detail:{title:e,description:s},bubbles:!0}))})}}customElements.define("lifestyle-card",c);async function a(){try{const e=await(await fetch("/api/hello")).json();alert(`✅ System Connected: ${e}`),console.log("System Response:",e)}catch(o){alert(`❌ System Error: ${o.message}`),console.error("System Error:",o)}}document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById("test-api");o&&o.addEventListener("click",a),document.addEventListener("lifestyle-card-click",e=>{const{title:s,description:i}=e.detail;console.log(`Lifestyle area selected: ${s}`)}),"serviceWorker"in navigator&&navigator.serviceWorker.register("/service-worker.js").then(e=>{console.log("✅ Service Worker registered:",e)}).catch(e=>{console.log("❌ Service Worker registration failed:",e)}),l()});function l(){console.log("🧘 Consciousness tracker initialized")}
