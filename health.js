// 1. FAST FADE-IN
if (typeof gsap !== 'undefined') {
    gsap.to("body", { opacity: 1, duration: 1, ease: "power2.out" });
}

/* ═══════════════════════════════════════
   MONTHLY PIE GRID LOGIC
═══════════════════════════════════════ */
const metricsDef = [
    { id: 'steps', label: 'Steps', color: 'var(--color-sage-green)', goal: 10000, unit: '' },
    { id: 'calories', label: 'Calories', color: '#f87171', goal: 2500, unit: ' kcal' },
    { id: 'sleep', label: 'Sleep', color: 'var(--color-dusty-lavender)', goal: 8, unit: ' hrs' },
    { id: 'water', label: 'Hydration', color: '#2563eb', goal: 3, unit: ' L' }
];

// Generate 30 days of randomized data
const monthlyData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    vals: [
        Math.floor(Math.random() * 8000) + 2000,
        Math.floor(Math.random() * 2000) + 500,
        Math.floor(Math.random() * 6) + 3,
        Math.floor(Math.random() * 2) + 1
    ],
    isToday: (i === 29) // Let's say Day 30 is today
}));

const monthGrid = document.getElementById('monthGrid');
const daySelector = document.getElementById('daySelector');
const tooltip = document.getElementById('pieTooltip');
let currentDay = 30; // Default to Day 30

function initMonthCharts() {
    if (!monthGrid || !daySelector) return;
    monthGrid.innerHTML = '';
    daySelector.innerHTML = '';
    
    monthlyData.forEach((data) => {
        // 1. Grid Pie
        const wrapper = document.createElement('div');
        wrapper.className = 'pie-wrapper';
        const label = document.createElement('span');
        label.className = 'day-label';
        label.innerText = `Day ${data.day}`;
        const container = document.createElement('div');
        container.className = 'pie-container';
        container.id = `pie-day-${data.day}`;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.className = 'pie-svg';
        svg.id = `svg-day-${data.day}`;
        const center = document.createElement('div');
        center.className = 'pie-center';
        container.appendChild(svg);
        container.appendChild(center);
        wrapper.appendChild(label);
        wrapper.appendChild(container);
        monthGrid.appendChild(wrapper);

        renderPie(data);
        setupBouncyAnimation(container);

        // 2. Day Selector Button
        const btn = document.createElement('button');
        btn.className = `w-8 h-8 rounded-lg flex items-center justify-center text-[0.65rem] font-bold transition-all ${data.day === currentDay ? 'bg-main text-white' : 'bg-main/5 text-muted hover:bg-main/10'}`;
        btn.innerText = data.day;
        btn.id = `btn-day-${data.day}`;
        btn.onclick = () => selectDay(data.day);
        daySelector.appendChild(btn);
    });
}

function selectDay(day) {
    // Update old button
    const oldBtn = document.getElementById(`btn-day-${currentDay}`);
    if(oldBtn) oldBtn.className = 'w-8 h-8 rounded-lg flex items-center justify-center text-[0.65rem] font-bold transition-all bg-white/5 text-gray-400 hover:bg-white/10';
    
    currentDay = day;
    const data = monthlyData[day-1];
    
    // Update new button
    const newBtn = document.getElementById(`btn-day-${day}`);
    if(newBtn) newBtn.className = 'w-8 h-8 rounded-lg flex items-center justify-center text-[0.65rem] font-bold transition-all bg-white text-black scale-110';

    // Load values to inputs
    const inputs = ['steps', 'calories', 'sleep', 'water'];
    inputs.forEach((id, i) => {
        const el = document.getElementById(`input-${id}`);
        if (el) {
            el.value = data.vals[i];
            el.dispatchEvent(new Event('input', { bubbles: true })); // Trigger visual ring update
        }
    });
    
    // Highlight the pie in the grid
    if (typeof gsap !== 'undefined') {
        gsap.to(`#pie-day-${day}`, { borderColor: 'white', duration: 0.3 });
    }
}

function renderPie(dayData) {
    const svg = document.getElementById(`svg-day-${dayData.day}`);
    if(!svg) return;
    let vals = dayData.vals;
    let totalActivity = 0;
    const scores = metricsDef.map((m, i) => {
        const val = vals[i];
        const pctOfGoal = Math.min((val / m.goal) * 100, 100);
        totalActivity += pctOfGoal;
        return { ...m, val, pctOfGoal };
    });
    const finalSlices = scores.map(s => {
        const slicePct = totalActivity === 0 ? 25 : (s.pctOfGoal / totalActivity) * 100;
        return { ...s, slicePct };
    });
    svg.innerHTML = '';
    let cumulativePercent = 0;
    finalSlices.forEach(slice => {
        const pathData = getCoordinatesForPercent(cumulativePercent, cumulativePercent + slice.slicePct);
        cumulativePercent += slice.slicePct;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', slice.color);
        path.setAttribute('class', 'pie-slice');
        path.style.setProperty('--glow', slice.color);
        path.addEventListener('mouseenter', () => {
            if (tooltip) {
                tooltip.innerHTML = `<strong>Day ${dayData.day}</strong><br><b style="color:${slice.color}">${slice.label}</b>: ${slice.val}${slice.unit}<br><span style="opacity:0.6;font-size:0.65rem">${slice.slicePct.toFixed(1)}% weight</span>`;
                tooltip.classList.add('active');
            }
        });
        path.addEventListener('mousemove', (e) => {
            if (tooltip) {
                tooltip.style.left = (e.clientX + 15) + 'px';
                tooltip.style.top = (e.clientY + 15) + 'px';
            }
        });
        path.addEventListener('mouseleave', () => {
            if (tooltip) tooltip.classList.remove('active');
        });
        svg.appendChild(path);
    });
}

function getCoordinatesForPercent(startPct, endPct) {
    const startX = Math.cos(2 * Math.PI * (startPct / 100));
    const startY = Math.sin(2 * Math.PI * (startPct / 100));
    const endX = Math.cos(2 * Math.PI * (endPct / 100));
    const endY = Math.sin(2 * Math.PI * (endPct / 100));
    const r = 45; const cx = 50; const cy = 50;
    const x1 = cx + startX * r; const y1 = cy + startY * r;
    const x2 = cx + endX * r;   const y2 = cy + endY * r;
    const largeArcFlag = endPct - startPct > 50 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

/* ═══════════════════════════════════════
   BOUNCY BALL PHYSICS (3-BOUNCE)
═══════════════════════════════════════ */
function setupBouncyAnimation(el) {
    let hasFallen = false;
    let returnTimeout = null;

    if (typeof gsap === 'undefined') return;

    el.addEventListener('mouseenter', () => {
        if (returnTimeout) { clearTimeout(returnTimeout); returnTimeout = null; }
        if (hasFallen) return; 
        hasFallen = true;

        gsap.to(el, { scale: 1.12, duration: 0.3, ease: "power3.out" });

        const tl = gsap.timeline();
        
        // Fall
        tl.to(el, { y: 280, duration: 0.7, ease: "power3.in" });
        
        // Bounce 1
        tl.to(el, { y: 240, duration: 0.35, ease: "power2.out" });
        tl.to(el, { y: 280, duration: 0.3, ease: "power2.in" });

        // Bounce 2
        tl.to(el, { y: 260, duration: 0.25, ease: "power2.out" });
        tl.to(el, { y: 280, duration: 0.2, ease: "power2.in" });

        // Bounce 3
        tl.to(el, { y: 272, duration: 0.15, ease: "power2.out" });
        tl.to(el, { y: 280, duration: 0.1, ease: "power2.in" });

        // Settle
        tl.to(el, { scale: 0.9, duration: 0.4, ease: "back.out(2)" });

        // Squash impacts
        tl.to(el, { scaleX: 1.25, scaleY: 0.75, duration: 0.1, yoyo: true, repeat: 1 }, "-=1.2");
        tl.to(el, { scaleX: 1.15, scaleY: 0.85, duration: 0.08, yoyo: true, repeat: 1 }, "-=0.4");
    });

    el.addEventListener('mouseleave', () => {
        if (!hasFallen) return;
        returnTimeout = setTimeout(() => {
            gsap.to(el, {
                y: 0, scale: 1, duration: 1.5,
                ease: "elastic.out(1, 0.75)",
                onComplete: () => { hasFallen = false; }
            });
        }, 2000);
    });
}

/* ═══════════════════════════════════════
   LIVE DATA HANDLER
═══════════════════════════════════════ */
function setupLiveInput(id, goal, successMsg) {
    const inputEl = document.getElementById(`input-${id}`);
    const ringEl = document.getElementById(`ring-${id}`);
    const msgEl = document.getElementById(`msg-${id}`);

    if (!inputEl || !ringEl || !msgEl) return;

    const updateRing = () => {
        let val = parseFloat(inputEl.value) || 0;
        let pct = Math.min((val / goal) * 100, 100);
        ringEl.style.setProperty('--percentage', `${pct}%`);
        if(pct >= 100) msgEl.innerText = successMsg;
        else if(pct > 0) msgEl.innerText = "Keep going!";
        else msgEl.innerText = `Click to type`;
    };

    inputEl.addEventListener('input', () => {
        updateRing();
        // Update specific day (Day 30) data
        monthlyData[29].vals[metricsDef.findIndex(m => m.id === id)] = parseFloat(inputEl.value) || 0;
        renderPie(monthlyData[29]);
    });
    updateRing();
}

window.addEventListener('DOMContentLoaded', () => {
    setupLiveInput('steps', 10000, "Goal Crushed!");
    setupLiveInput('calories', 2500, "Daily Fuel Acquired!");
    setupLiveInput('sleep', 8.0, "Fully Rested!");
    setupLiveInput('water', 3.0, "Hydration Maxed!");

    initMonthCharts();

    // Entrance Animations
    if (typeof gsap !== 'undefined') {
        gsap.from(".header-text", { y: -30, opacity: 0, duration: 1, delay: 0.1, ease: "power3.out" });
        gsap.from(".cards-container > div", { y: 50, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.3, ease: "power3.out" });
        
        // Entrance Month Grid (Staggered)
        gsap.from(".pie-wrapper", { 
            scale: 0.8, opacity: 0, y: 30,
            duration: 0.8, stagger: 0.03, delay: 1,
            ease: "back.out(1.5)" 
        });
    }

    // Initialize Today (Day 30) with mock data + sync the inputs
    setTimeout(() => {
        const sIn = document.getElementById('input-steps');
        const cIn = document.getElementById('input-calories');
        const wIn = document.getElementById('input-water');
        if (sIn) { sIn.value = 8200; sIn.dispatchEvent(new Event('input')); }
        if (cIn) { cIn.value = 1450; cIn.dispatchEvent(new Event('input')); }
        if (wIn) { wIn.value = 1.2;  wIn.dispatchEvent(new Event('input')); }
    }, 1800);
});

window.transitionTo = function(url) {
    if (typeof gsap !== 'undefined') {
        gsap.to("body", { opacity: 0, duration: 0.5, ease: "power2.inOut", onComplete: () => window.location.href = url });
    } else {
        window.location.href = url;
    }
}
