if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════
   1 · DATA (In-Memory Only)
═══════════════════════════════════════ */
const data = {};
// data[day] = { motto: "", notes: "", completed: false }

let currentDay = null;

/* ═══════════════════════════════════════
   2 · GENERATE 30 DAY CARDS
═══════════════════════════════════════ */
const grid = document.getElementById('calendar-grid');

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t]));
}

if (grid) {
    for (let i = 1; i <= 30; i++) {
        const d = data[i] || {};
        const card = document.createElement('div');
        card.className = 'day-card card-anim';
        card.dataset.day = i;

        buildCard(card, i, d);
        card.addEventListener('click', () => openModal(i));
        grid.appendChild(card);
    }
}

function buildCard(card, day, d) {
    const hasMotto = d.motto && d.motto.trim();
    const isComplete = d.completed;

    card.classList.toggle('filled', !!hasMotto);
    card.classList.toggle('completed', !!isComplete);

    card.innerHTML = `
<div class="completion-check">
    <svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3"/></svg>
</div>
<div class="day-number">Day ${day}</div>
<div class="motto-content flex-grow flex items-center">
    ${hasMotto
            ? `<div class="motto-text font-editorial italic text-lg">${escapeHTML(d.motto)}</div>`
            : `<div class="motto-placeholder text-muted opacity-30">+ Add task</div>`}
</div>
`;
}

/* ═══════════════════════════════════════
   3 · MODAL
═══════════════════════════════════════ */
const modal = document.getElementById('edit-modal');
const modalTitle = document.getElementById('modal-title');
const mottoInput = document.getElementById('motto-input');
const notesInput = document.getElementById('notes-input');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const closeBtn = document.getElementById('close-modal');
const toggleEl = document.getElementById('toggle-complete');

function openModal(day) {
    currentDay = day;
    const d = data[day] || {};
    if (modalTitle) modalTitle.textContent = `Day ${day} Mission`;
    if (mottoInput) mottoInput.value = d.motto || '';
    if (notesInput) notesInput.value = d.notes || '';
    if (toggleEl) toggleEl.classList.toggle('checked', !!d.completed);
    if (modal) {
        modal.classList.add('active');
        setTimeout(() => { if (mottoInput) mottoInput.focus(); }, 120);
    }
}

function closeModal() {
    if (modal) modal.classList.remove('active');
    currentDay = null;
}

function saveDay() {
    if (currentDay === null) return;
    const motto = mottoInput ? mottoInput.value.trim() : '';
    const notes = notesInput ? notesInput.value.trim() : '';
    const completed = toggleEl ? toggleEl.classList.contains('checked') : false;

    if (motto || notes) {
        data[currentDay] = { motto, notes, completed };
    } else {
        delete data[currentDay];
    }

    // Update card
    const card = document.querySelector(`.day-card[data-day="${currentDay}"]`);
    if (card) {
        buildCard(card, currentDay, data[currentDay] || {});

        // Pop animation
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(card,
                { scale: 0.92, opacity: 0.7 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.8)" }
            );
        }
    }

    closeModal();
}

if (toggleEl) {
    toggleEl.addEventListener('click', () => {
        toggleEl.classList.toggle('checked');
    });
}

if (saveBtn) saveBtn.addEventListener('click', saveDay);
if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
if (closeBtn) closeBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'Enter' && e.ctrlKey) saveDay();
    }
});

if (modal) {
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
}

/* ═══════════════════════════════════════
   4 · ANIMATIONS
═══════════════════════════════════════ */
window.addEventListener('load', () => {
    if (typeof gsap !== 'undefined') {
        // Page fade
        gsap.to("body", { opacity: 1, duration: 0.7, ease: "power2.out" });

        // Header
        gsap.from(".header-text", {
            y: -40, opacity: 0, duration: 1.2, delay: 0.1, ease: "power3.out"
        });

        // Card entrance (staggered scale + fade)
        gsap.from(".card-anim", {
            opacity: 0, scale: 0.95,
            duration: 0.55,
            stagger: 0.035,
            delay: 0.25,
            ease: "back.out(1.3)"
        });
    }
});

/* ═══════════════════════════════════════
   6 · PARTICLES
═══════════════════════════════════════ */
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.5 + 0.4,
            vy: -(Math.random() * 0.2 + 0.06),
            vx: (Math.random() - 0.5) * 0.12,
            opacity: Math.random() * 0.3 + 0.1
        });
    }

    (function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 150, 200, ${p.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(drawParticles);
    })();
}

/* ═══════════════════════════════════════
   7 · MOUSE PARALLAX (bg only)
═══════════════════════════════════════ */
let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5;
document.addEventListener('mousemove', e => {
    mx = e.clientX / window.innerWidth;
    my = e.clientY / window.innerHeight;
});

/* ═══════════════════════════════════════
   8 · PAGE TRANSITION
═══════════════════════════════════════ */
window.transitionTo = function(url) {
    if (typeof gsap !== 'undefined') {
        gsap.to("body", {
            opacity: 0, duration: 0.45,
            ease: "power2.inOut",
            onComplete: () => { window.location.href = url; }
        });
    } else {
        window.location.href = url;
    }
}
