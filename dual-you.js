// Intro animation
gsap.to("body", { opacity: 1, duration: 1, ease: "power2.out" });

// Generate 2D Particles
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
    const colors = ['#FFD6C9', '#DCEEFF', '#DDEAD1', '#E6E0F8'];
    
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 200 + 100;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        particlesContainer.appendChild(p);

        // 2D drift animation
        gsap.to(p, {
            x: 'random(-100, 100)',
            y: 'random(-100, 100)',
            duration: 'random(10, 20)',
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}

// Parallax Effect
window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    // Move background at 30% of scroll speed
    gsap.to("#parallax-bg", { y: y * 0.3, duration: 0.1, overwrite: true });
});

gsap.from(".header-text", { y: -30, opacity: 0, duration: 1, delay: 0.1, ease: "power3.out" });
gsap.from(".inputs-container > div", { y: 50, opacity: 0, duration: 0.8, stagger: 0.2, delay: 0.3, ease: "power3.out" });
gsap.from("#verdict-btn-wrapper", { scale: 0.8, opacity: 0, duration: 0.8, delay: 0.7, ease: "back.out(1.7)", clearProps: "all" });

window.transitionTo = function(url) {
    gsap.to("body", { opacity: 0, duration: 0.6, ease: "power2.inOut", onComplete: () => window.location.href = url });
}

// Logic for AI Verdict
const btn = document.getElementById('seek-verdict-btn');
const overlay = document.getElementById('verdict-overlay');
const box = document.getElementById('verdict-box');
const title = document.getElementById('verdict-title');
const text = document.getElementById('verdict-text');
const closeBtn = document.getElementById('close-verdict-btn');

const emotionalInput = document.getElementById('emotional-input');
const intellectualInput = document.getElementById('intellectual-input');

const verdicts = [
    "Your intuition is valid, but the facts cannot be ignored. Acknowledge the risk while cautiously pursuing what you feel. Compromise is required.",
    "The logic points to a clear path, but your emotional hesitation indicates unaddressed fears. Do not act until your mind resolves this friction.",
    "Emotion and intellect are in rare harmony here. Your reasoning is sound and your heart is aligned. Proceed with absolute confidence.",
    "Your heart is dominating this narrative, overshadowing realistic consequences. Step back for 24 hours. Let logic catch up before you decide.",
    "Intellectually, it makes sense, but emotionally, you are disconnected. If you proceed, you may succeed on paper but feel hollow. Re-evaluate your 'why'.",
    "This conflict cannot be resolved today. Both sides present strong arguments. The AI advises patience: wait for new variables to emerge.",
    "You are using logic to justify a purely emotional desire. Be honest with yourself about what you want, and stop pretending it's the rational choice."
];

let isProcessing = false;

if (btn) {
    btn.addEventListener('click', () => {
        if (isProcessing) return;
        const eVal = emotionalInput.value.trim();
        const iVal = intellectualInput.value.trim();

        if (!eVal || !iVal) {
            alert("The AI requires both Emotional and Intellectual reasoning to render a verdict.");
            return;
        }

        isProcessing = true;

        // Show Overlay (Processing State)
        title.innerText = "Analyzing Reasoning...";
        text.innerHTML = '<span class="pulse-text">Weighing emotion against intellect...</span>';
        closeBtn.style.opacity = "0";
        closeBtn.style.pointerEvents = "none";
        
        gsap.to(overlay, { opacity: 1, pointerEvents: "auto", duration: 0.5 });
        gsap.to(box, { scale: 1, duration: 0.5, ease: "back.out(1.2)" });

        // Simulate AI Delay
        setTimeout(() => {
            // Generate pseudo-random deterministic verdict based on input lengths
            const hash = (eVal.length * 31 + iVal.length * 17) % verdicts.length;
            const finalVerdict = verdicts[hash];

            title.innerText = "The Verdict";
            text.innerText = "";
            
            // Typing effect
            let i = 0;
            function typeWriter() {
                if (i < finalVerdict.length) {
                    text.innerHTML += finalVerdict.charAt(i);
                    i++;
                    setTimeout(typeWriter, 30);
                } else {
                    gsap.to(closeBtn, { opacity: 1, duration: 0.5 });
                    closeBtn.style.pointerEvents = "auto";
                }
            }
            typeWriter();

        }, 2500); // 2.5 seconds processing time
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        gsap.to(overlay, { opacity: 0, pointerEvents: "none", duration: 0.4, onComplete: () => { isProcessing = false; } });
        gsap.to(box, { scale: 0.9, duration: 0.4 });
    });
}
