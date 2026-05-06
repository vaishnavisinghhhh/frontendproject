// --- 1. INTRO & HABITS ---
window.onload = () => {
    if (typeof gsap !== 'undefined') {
        gsap.to("body", { opacity: 1, duration: 1.5, ease: "power2.out" });
        gsap.from("header", { y: -20, opacity: 0, duration: 1.2, ease: "power3.out" });
        gsap.from("main", { y: 30, opacity: 0, duration: 1.2, delay: 0.3, ease: "power3.out" });
    }
    loadHabits();
    reframeEngine.init();
};

// --- 2. AMBIENT MODE ---
let isDarkMode = false;
window.toggleAmbientMode = function() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-zen', isDarkMode);
    const icon = document.getElementById('ambient-icon');
    if (icon) {
        icon.className = isDarkMode ? 'ph ph-moon-stars text-2xl text-sky-400' : 'ph ph-sun text-2xl text-orange-400';
    }
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(".waves-bg", { opacity: 0.1 }, { opacity: 0.35, duration: 1.5 });
    }
}

// --- 3. AFFIRMATION ENGINE ---
const affirmations = [
    "You are becoming who you needed.",
    "Small steps still move you forward.",
    "You are enough, exactly as you are.",
    "Peace begins with a single breath.",
    "Your potential is limitless.",
    "I choose to be kind to myself.",
    "Today's rest is tomorrow's strength."
];
window.generateAffirmation = function() {
    const text = document.getElementById('affirmation-text');
    if (!text) return;
    const random = affirmations[Math.floor(Math.random() * affirmations.length)];
    if (typeof gsap !== 'undefined') {
        gsap.to(text, {
            opacity: 0, y: -5, duration: 0.4, onComplete: () => {
                text.innerText = random;
                gsap.to(text, { opacity: 1, y: 0, duration: 0.4 });
            }
        });
    } else {
        text.innerText = random;
    }
}

// --- 4. FOCUS TIMER ---
let timerSeconds = 900;
let timerActive = false;
let timerInterval;
let totalSeconds = 900;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

window.setTimer = function(m) {
    clearInterval(timerInterval);
    timerActive = false;
    timerSeconds = m * 60;
    totalSeconds = m * 60;
    updateTimerDisplay();
    const btn = document.getElementById('timer-btn');
    if (btn) btn.innerText = "Start Focus";
}

window.toggleTimer = function() {
    timerActive = !timerActive;
    const btn = document.getElementById('timer-btn');
    if (!btn) return;
    
    if (timerActive) {
        btn.innerText = "Pause Session";
        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();
            playTick();
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerActive = false;
                btn.innerText = "Start Focus";
                alert("Session Complete. Take a moment for yourself.");
            }
        }, 1000);
    } else {
        btn.innerText = "Resume Focus";
        clearInterval(timerInterval);
    }
}

function updateTimerDisplay() {
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    const display = document.getElementById('timer-display');
    if (display) display.innerText = \`\${m}:\${s.toString().padStart(2, '0')}\`;
    
    const progress = document.getElementById('timer-progress');
    if (progress) {
        const offset = 440 - (440 * (timerSeconds / totalSeconds));
        progress.style.strokeDashoffset = offset;
    }
}

function playTick() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.005, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}

// --- 5. MICRO HABITS ---
window.toggleHabit = function(h) {
    const habits = JSON.parse(localStorage.getItem('zen-habits') || '{}');
    habits[h] = !habits[h];
    localStorage.setItem('zen-habits', JSON.stringify(habits));
}
function loadHabits() {
    const habits = JSON.parse(localStorage.getItem('zen-habits') || '{}');
    document.querySelectorAll('.habit-checkbox').forEach((cb, i) => {
        const keys = ['meditated', 'water', 'positive'];
        cb.checked = !!habits[keys[i]];
    });
}

// --- 6. EXPANDABLE MODAL ---
const modal = document.getElementById('zen-modal');
const modalBody = document.getElementById('modal-body');
const contentBank = {
    "Daily Reflection": {
        desc: "Journaling is a mirror for the soul. By putting pen to paper, you detach from the noise and see your thoughts with clarity.",
        activity: "Write down one thing you're letting go of today. Feel the weight lift."
    },
    "Rhythmic Breathing": {
        desc: "Breathing is the only autonomic function you can consciously control. It's your direct remote control for the nervous system.",
        activity: "Place a hand on your heart. Inhale for 4, hold for 4, exhale for 8. Repeat twice."
    },
    "Internal Mirror": {
        desc: "The world is a reflection of your internal state. When you find peace within, the chaos outside begins to settle.",
        activity: "Look into a mirror and offer yourself a genuine smile. It signals safety to your brain."
    },
    "Daily Challenge": {
        desc: "Challenge is where growth happens. Today's practice of silent observation sharpens your focus and reduces reactivity.",
        activity: "For the next 5 minutes, turn off all notifications and just sit with your environment."
    }
};

document.querySelectorAll('.zen-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (['BUTTON', 'A', 'TEXTAREA', 'INPUT'].includes(e.target.tagName)) return;
        const h3 = card.querySelector('h3');
        const title = h3 ? h3.innerText : "Sanctuary Insight";
        openModal(title.trim());
    });
});

window.openModal = function(title) {
    if (!modal || !modalBody) return;
    const data = contentBank[title] || { desc: "Deepen your practice. This module helps you integrate mindfulness into your daily routine.", activity: "Take 3 deep breaths before closing. Notice the sensation of presence." };
    modal.style.display = 'flex';
    modalBody.innerHTML = \`
        <h2 class="font-display text-4xl mb-6 text-white">\${title}</h2>
        <div class="font-zen text-2xl text-white/60 leading-relaxed mb-10">\${data.desc}</div>
        <div class="p-8 bg-white/5 rounded-3xl border border-white/10">
            <h4 class="font-bold uppercase text-xs tracking-widest mb-4 text-sky-300">Guided Activity</h4>
            <p class="text-white/80 text-lg">\${data.activity}</p>
        </div>
    \`;
    if (typeof gsap !== 'undefined') {
        gsap.to(modal, { opacity: 1, duration: 0.5 });
        gsap.from(".modal-content", { y: 30, opacity: 0, duration: 0.5 });
    }
}
window.closeModal = function(e) {
    if (e) e.stopPropagation();
    if (!modal) return;
    if (typeof gsap !== 'undefined') {
        gsap.to(modal, { opacity: 0, duration: 0.4, onComplete: () => modal.style.display = 'none' });
    } else {
        modal.style.display = 'none';
    }
}

// --- 7. BREATHING ENGINE ---
let breathing = false;
let breathInterval;
window.toggleBreathing = function() {
    const breatheText = document.getElementById('breatheText');
    const visualizer = document.getElementById('breatheVisualizer');
    const breathingBtn = document.getElementById('breathing-btn');
    
    if (!breatheText || !visualizer || !breathingBtn) return;
    
    breathing = !breathing;
    if (breathing) {
        breathingBtn.innerText = "Pause/End Session";
        breathingBtn.classList.add('active');
        runBreathCycle(breatheText, visualizer);
        breathInterval = setInterval(() => runBreathCycle(breatheText, visualizer), 12000);
    } else {
        clearInterval(breathInterval);
        breathingBtn.innerText = "Start Session";
        breathingBtn.classList.remove('active');
        breatheText.innerText = "Paused";
        if (typeof gsap !== 'undefined') {
            gsap.to(visualizer, { scale: 1, duration: 1 });
        }
    }
}
function runBreathCycle(breatheText, visualizer) {
    if (!breathing) return;
    breatheText.innerText = "Breath In";
    if (typeof gsap !== 'undefined') gsap.to(visualizer, { scale: 1.3, duration: 4, ease: "sine.inOut" });
    setTimeout(() => {
        if (!breathing) return;
        breatheText.innerText = "Hold";
        setTimeout(() => {
            if (!breathing) return;
            breatheText.innerText = "Breath Out";
            if (typeof gsap !== 'undefined') gsap.to(visualizer, { scale: 1, duration: 4, ease: "sine.inOut" });
        }, 4000);
    }, 4000);
}

// --- 8. REFRAME ENGINE ---
const reframeData = [
    { front: "I’m not good enough.", back: "I’m still learning, and that’s exactly where I need to be." },
    { front: "I always mess things up.", back: "I grow every time I try. Mistakes are just proof I'm trying." },
    { front: "No one understands me.", back: "The right people will understand me, and I understand myself." },
    { front: "It's too late to start.", back: "Every moment is a fresh beginning. My timeline is my own." },
    { front: "I can't handle this.", back: "I have survived 100% of my bad days. I will figure this out." }
];

window.reframeEngine = {
    currentIndex: 0,
    rendered: false,
    init() {
        const deck = document.getElementById('reframeDeck');
        if (!deck) return;
        deck.innerHTML = '';
        reframeData.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = 'reframe-card';
            card.innerHTML = \`
                <div class="reframe-face reframe-front font-zen text-3xl italic tracking-wide">
                    "\${data.front}"
                </div>
                <div class="reframe-face reframe-back flex flex-col items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] transition-transform duration-1000 ease-in-out shimmer-effect"></div>
                    <i class="ph ph-sparkle text-3xl mb-4 opacity-50"></i>
                    <span class="font-display text-2xl leading-relaxed text-center">\${data.back}</span>
                </div>
            \`;
            card.onclick = () => {
                if (index === this.currentIndex) {
                    card.classList.toggle('flipped');
                    if(card.classList.contains('flipped') && typeof gsap !== 'undefined') {
                        gsap.fromTo(card.querySelector('.shimmer-effect'), {x: '-100%'}, {x: '100%', duration: 1.5, ease: 'power2.inOut', delay: 0.3});
                    }
                } else {
                    this.goTo(index);
                }
            };
            deck.appendChild(card);
        });
        this.rendered = true;
        this.updateStack();
    },
    updateStack() {
        const cards = document.querySelectorAll('#reframeDeck .reframe-card');
        cards.forEach((card, index) => {
            card.classList.remove('flipped'); // Reset flip on navigate
            const diff = index - this.currentIndex;
            if (typeof gsap !== 'undefined') {
                if (diff === 0) {
                    gsap.to(card, { y: 0, scale: 1, opacity: 1, zIndex: 10, duration: 0.5 });
                    card.style.pointerEvents = 'auto';
                } else if (diff > 0) {
                    gsap.to(card, { y: diff * 15, scale: 1 - (diff * 0.05), opacity: 1 - (diff * 0.2), zIndex: 10 - diff, duration: 0.5 });
                    card.style.pointerEvents = diff <= 2 ? 'auto' : 'none';
                } else {
                    // Past cards slide away
                    gsap.to(card, { y: -50, scale: 1.1, opacity: 0, zIndex: 0, duration: 0.5 });
                    card.style.pointerEvents = 'none';
                }
            } else {
                if (diff === 0) {
                    card.style.transform = 'none';
                    card.style.opacity = '1';
                    card.style.zIndex = '10';
                    card.style.pointerEvents = 'auto';
                } else {
                    card.style.opacity = '0';
                    card.style.pointerEvents = 'none';
                }
            }
        });
    },
    next() {
        if (this.currentIndex < reframeData.length - 1) {
            this.currentIndex++;
            this.updateStack();
        }
    },
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateStack();
        }
    },
    goTo(index) {
        if (index > this.currentIndex && index > this.currentIndex + 1) return; // Optional to limit jumps
        this.currentIndex = index;
        this.updateStack();
    },
    saveCurrent() {
        // Here we can trigger a visual effect on the save button
        if (!event) return;
        const btn = event.target;
        if (!btn) return;
        const originalText = btn.innerText;
        btn.innerText = "Saved!";
        btn.classList.add('bg-green-100', 'text-green-800');
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('bg-green-100', 'text-green-800');
        }, 2000);
    }
};

// --- 9. TRANSITIONS ---
window.transitionTo = function (url) {
    if (typeof gsap !== 'undefined') {
        gsap.to("body", { opacity: 0, duration: 0.8, onComplete: () => window.location.href = url });
    } else {
        window.location.href = url;
    }
}
