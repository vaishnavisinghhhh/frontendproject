if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════
   REFS
   ═══════════════════════════════════════ */
const cards = typeof gsap !== 'undefined' ? gsap.utils.toArray('.portal-card') : document.querySelectorAll('.portal-card');
const stage = document.getElementById('portalStage');
const bgBase = document.getElementById('bgBase');
let animated = false;

/* ═══════════════════════════════════════
   1 · PAGE FADE
   ═══════════════════════════════════════ */
if (typeof gsap !== 'undefined') {
    gsap.to("body", { opacity: 1, duration: 0.5, ease: "power2.out" });

    /* ═══════════════════════════════════════
       2 · HEADER
       ═══════════════════════════════════════ */
    gsap.from(".header-block", { y: -45, opacity: 0, duration: 0.8, delay: 0.1, ease: "power3.out" });
}

/* ═══════════════════════════════════════
   3 · FLOATING PARTICLES (Canvas)
   ═══════════════════════════════════════ */
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Pastel colors for particles
    const pColors = ['#FFF4C2', '#DCEEFF', '#FFD6C9', '#DDEAD1', '#E6E0F8'];

    // Create particles
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.8 + 0.5,
            vy: -(Math.random() * 0.25 + 0.08),     // slow upward
            vx: (Math.random() - 0.5) * 0.15,        // tiny horizontal drift
            opacity: Math.random() * 0.4 + 0.2,
            color: pColors[Math.floor(Math.random() * pColors.length)]
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap
            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(drawParticles);
    }
    drawParticles();
}

/* ═══════════════════════════════════════
   4 · CARD OFFSETS (from grid → center)
═══════════════════════════════════════ */
function screenCenter() {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

function cardOffsets() {
    const c = screenCenter();
    // using Array.from(cards) ensures compatibility whether it's an array or NodeList
    return Array.from(cards).map(card => {
        const r = card.getBoundingClientRect();
        return {
            dx: c.x - (r.left + r.width / 2),
            dy: c.y - (r.top + r.height / 2)
        };
    });
}

/* ═══════════════════════════════════════
   5 · PORTAL EMERGE
   Cards stay in grid flow. GSAP transform
   stacks them visually at center, then
   animates to (0,0) = their grid slot.
═══════════════════════════════════════ */
function portalEmerge() {
    if (animated || typeof gsap === 'undefined') return;
    animated = true;

    const offsets = cardOffsets();

    cards.forEach((card, i) => {
        gsap.set(card, {
            x: offsets[i].dx,
            y: offsets[i].dy,
            scale: 0.5,
            opacity: 0,
            filter: "blur(12px) brightness(1.35)",
            transformOrigin: "center center"
        });

        gsap.to(card, {
            x: 0, y: 0,
            scale: 1, opacity: 1,
            filter: "blur(0px) brightness(1)",
            duration: 0.8,
            delay: 0.2 + (i * 0.05),
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            onComplete: () => {
                gsap.set(card, { clearProps: "x,y,scale,filter,opacity,transform" });
                card.classList.add('floating');
            }
        });
    });
}

/* ═══════════════════════════════════════
   6 · SCROLL TRIGGER
═══════════════════════════════════════ */
if (typeof ScrollTrigger !== 'undefined' && stage) {
    ScrollTrigger.create({
        trigger: "#portalStage",
        start: "top 92%",
        once: true,
        onEnter: portalEmerge
    });

    requestAnimationFrame(() => {
        if (stage.getBoundingClientRect().top < window.innerHeight * 0.92) portalEmerge();
    });
}

/* ═══════════════════════════════════════
   7 · CARD HOVER (NO 3D)
═══════════════════════════════════════ */
if (typeof gsap !== 'undefined') {
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.05,
                y: -8,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

/* ═══════════════════════════════════════
   9 · CARD SPOTLIGHT
═══════════════════════════════════════ */
cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
});

/* ═══════════════════════════════════════
   10 · EXIT (reverse portal)
═══════════════════════════════════════ */
window.exitPage = function(url) {
    if (typeof gsap !== 'undefined') {
        const offsets = cardOffsets();

        cards.forEach((card, i) => {
            card.classList.remove('floating');
            card.style.animation = 'none';

            gsap.to(card, {
                x: offsets[i].dx, y: offsets[i].dy,
                scale: 0.4, opacity: 0,
                filter: "blur(10px)",
                duration: 0.5, delay: i * 0.04,
                ease: "power3.inOut"
            });
        });

        gsap.to(".header-block", { opacity: 0, y: -25, duration: 0.35, ease: "power2.inOut" });

        gsap.to("body", {
            opacity: 0, duration: 0.45, delay: 0.38,
            ease: "power2.inOut",
            onComplete: () => { window.location.href = url; }
        });
    }

    // Fallback: Force redirect if animation is stuck or gsap is undefined
    setTimeout(() => { window.location.href = url; }, 1200);
}
