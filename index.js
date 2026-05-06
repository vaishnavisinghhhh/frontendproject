// Optimization: Component-based generation for Flip Cards to eliminate duplicate HTML bloat
const flipCardsData = [
    { icon1: 'ph-cloud-rain', text1: '"I should be doing more."', icon2: 'ph-sun', text2: '"I am doing exactly enough for today."', themeColorClass: 'text-[#6A9AC4]', bgClass: 'from-white to-[#E8F4FD]', borderClass: 'border-[rgba(106,154,196,0.3)]' },
    { icon1: 'ph-spiral', text1: '"I\'m falling behind."', icon2: 'ph-plant', text2: '"My growth happens at my own unique pace."', themeColorClass: 'text-[#9b87b5]', bgClass: 'from-white to-[#F9F5FF]', borderClass: 'border-[rgba(155,135,181,0.3)]' },
    { icon1: 'ph-lock-key', text1: '"This is too hard for me."', icon2: 'ph-key', text2: '"I can handle difficult things one step at a time."', themeColorClass: 'text-[#729b5e]', bgClass: 'from-white to-[#F2FCEE]', borderClass: 'border-[rgba(114,155,94,0.3)]' }
];

const flipContainer = document.getElementById('flipCardsContainer');
if (flipContainer) {
    flipContainer.innerHTML = flipCardsData.map(card => `
        <div class="flip-card group h-72 w-full cursor-pointer">
            <div class="relative w-full h-full transition-transform duration-[600ms] ease-out transform-style-3d group-hover:rotate-y-180">
                <div class="absolute inset-0 backface-hidden bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col justify-center items-center shadow-sm border border-[rgba(0,0,0,0.05)]">
                    <i class="ph-light ${card.icon1} text-[3rem] text-gray-400 mb-6 drop-shadow-sm"></i>
                    <p class="font-editorial text-2xl text-gray-600 font-medium italic">${card.text1}</p>
                </div>
                <div class="absolute inset-0 backface-hidden bg-gradient-to-br ${card.bgClass} rounded-[2.5rem] p-8 flex flex-col justify-center items-center shadow-md border ${card.borderClass} rotate-y-180">
                    <i class="ph-light ${card.icon2} text-[3rem] ${card.themeColorClass} mb-6 drop-shadow-sm"></i>
                    <p class="font-editorial text-2xl text-gray-800 font-medium italic">${card.text2}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Optimization: Cache DOM Elements outside functions to prevent repeated querying
const overlay = document.getElementById('emotionalTransition');
const textEl = document.getElementById('emotionalText');
const focusOverlay = document.getElementById('focusOverlay');
const focusContent = document.getElementById('focusContent');

const emotionalCues = ["Take a breath...", "You're doing okay.", "Let's slow this down.", "One step at a time."];

window.transitionTo = function(url) {
    if(overlay && textEl) {
        textEl.innerText = emotionalCues[Math.floor(Math.random() * emotionalCues.length)];
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100', 'pointer-events-auto');

        setTimeout(() => {
            textEl.style.opacity = '1';
            textEl.style.transform = 'translateY(0) scale(1)';
        }, 500);

        setTimeout(() => {
            textEl.style.opacity = '0';
            textEl.style.transform = 'translateY(-15px) scale(1.02)';
            setTimeout(() => window.location.href = url, 1000);
        }, 3000);
    } else {
        window.location.href = url;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Optimization: Single Intersection Observer Instance acting as minimal fallback for scroll triggers
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal-section').forEach(sec => observer.observe(sec));

    // Optimization: Clean Event Delegation for Flip Cards
    if (flipContainer) {
        flipContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.flip-card');
            if (!card) return;

            focusContent.innerHTML = `<div class="group h-full w-full cursor-default perspective-1000">${card.innerHTML}</div>`;
            focusOverlay.classList.remove('opacity-0', 'pointer-events-none');
            focusOverlay.classList.add('opacity-100', 'pointer-events-auto');

            // Trigger standard CSS transitions
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    focusContent.classList.remove('scale-95', 'opacity-0');
                    focusContent.classList.add('scale-100', 'opacity-100');
                });
            });
        });
    }

    // Centralized close logic for Focus Overlay
    if (focusOverlay) {
        focusOverlay.addEventListener('click', (e) => {
            if (e.target === focusOverlay || e.target.closest('#closeFocus')) {
                focusContent.classList.remove('scale-100', 'opacity-100');
                focusContent.classList.add('scale-95', 'opacity-0');

                setTimeout(() => {
                    focusOverlay.classList.remove('opacity-100', 'pointer-events-auto');
                    focusOverlay.classList.add('opacity-0', 'pointer-events-none');
                    setTimeout(() => focusContent.innerHTML = '', 500); // clear on animation end
                }, 300);
            }
        });
    }
});
