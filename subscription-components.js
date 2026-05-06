class PricingPlansSection extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
    <!-- SUBSCRIPTION TEASER -->
    <section class="py-32 px-6">
        <div class="max-w-5xl mx-auto text-center">
            <h2 class="font-editorial text-4xl md:text-5xl font-semibold mb-6">Find What Feels Right</h2>
            <p class="text-muted max-w-2xl mx-auto text-lg leading-relaxed mb-16 font-light">
                Start free and explore at your own pace, or unlock deeper guidance whenever you feel ready. No pressure, just support.
            </p>

            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">

                <!-- Free Tier -->
                <div class="glass-card p-10 text-center flex flex-col items-center subscribe-card h-full">
                    <div style="background: var(--color-sage-green);" class="w-10 h-10 rounded-full flex items-center justify-center mb-6">
                        <i class="ph-bold ph-leaf text-lg" style="color: #4A6741;"></i>
                    </div>
                    <h3 class="font-editorial text-2xl font-semibold mb-2">Free</h3>
                    <p class="text-muted font-light text-sm leading-relaxed mb-6 flex-grow">
                        Daily journaling, mood tracking, breathing exercises, and your personal photo gallery.
                    </p>
                    <span class="font-display text-3xl font-bold">$0</span>
                    <span class="text-muted text-xs mt-1 tracking-widest uppercase">Forever</span>
                    <button class="w-full py-3.5 mt-8 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-400 bg-white hover:shadow-md" style="color: #4A6741; border: 1px solid rgba(74, 103, 65, 0.15);" onclick="alert('Started Free Plan')">
                        Start Free
                    </button>
                </div>

                <!-- Premium Tier -->
                <div class="glass-card p-10 text-center flex flex-col items-center subscribe-card h-full" style="background: linear-gradient(155deg, rgba(230,224,248,0.35) 0%, rgba(255,212,192,0.2) 50%, rgba(255,244,194,0.25) 100%); border-color: rgba(230,224,248,0.3);">
                    <div style="background: linear-gradient(135deg, var(--color-dusty-lavender), var(--color-muted-peach));" class="w-10 h-10 rounded-full flex items-center justify-center mb-6">
                        <i class="ph-bold ph-sun text-lg" style="color: #5B4A6B;"></i>
                    </div>
                    <h3 class="font-editorial text-2xl font-semibold mb-2">Premium</h3>
                    <p class="text-muted font-light text-sm leading-relaxed mb-6 flex-grow">
                        Personalized routines, AI decision clarity, guided meditations, and emotional pattern insights.
                    </p>
                    <span class="font-display text-3xl font-bold">$9</span>
                    <span class="text-muted text-xs mt-1 tracking-widest uppercase">Per Month</span>
                    <button class="w-full py-3.5 mt-8 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-400 bg-white hover:shadow-md" style="color: #5B4A6B; border: 1px solid rgba(91, 74, 107, 0.15);" onclick="alert('Proceeding to Checkout')">
                        Upgrade
                    </button>
                </div>

            </div>
        </div>
    </section>
        `;
    }
}
customElements.define('pricing-plans-section', PricingPlansSection);

class DigitalPacksSection extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
    <!-- DIGITAL PACKS SECTION -->
    <section class="py-32 px-6" style="background: linear-gradient(180deg, transparent, rgba(230,224,248,0.15), transparent);">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-20">
                <span class="text-[0.65rem] uppercase tracking-[0.3em] font-bold text-muted opacity-60 mb-4 block">Self-Guided Modules</span>
                <h2 class="font-editorial text-4xl md:text-5xl font-semibold mb-6">One-Time Digital Packs</h2>
                <p class="text-muted text-lg leading-relaxed max-w-xl mx-auto font-light">
                    Targeted, gentle resets for specific mental hurdles. Purchase once, keep forever. 
                    <span class="block mt-2 italic text-gray-400">Take it at your own pace &mdash; start whenever you feel ready.</span>
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 items-stretch">
                
                <!-- Pack 1 -->
                <div class="glass-card pack-card relative overflow-hidden group flex flex-col p-10 h-full transition-all duration-500 hover:-translate-y-2 cursor-pointer" style="background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,214,201,0.2)); border-color: rgba(255,214,201,0.6);">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style="background: var(--color-muted-peach);">
                            <i class="ph-light ph-wind text-2xl" style="color: #D88A70;"></i>
                        </div>
                        <span class="text-[0.65rem] uppercase tracking-widest font-bold" style="color: #D88A70;">7 Days Focus</span>
                    </div>
                    
                    <h3 class="font-editorial text-2xl font-semibold mb-4">7-Day Anxiety Reset</h3>
                    <p class="text-muted font-light text-sm leading-relaxed mb-10 flex-grow">
                        Slow down a racing mind with gentle breathing practices, grounding daily reflections, and nervous system regulation.
                    </p>
                    
                    <button class="w-full py-3.5 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-400 bg-white group-hover:shadow-[0_8px_25px_rgba(255,214,201,0.45)]" style="color: #D88A70; border: 1px solid rgba(216,138,112,0.15);">
                        Start this journey
                    </button>
                </div>

                <!-- Pack 2 -->
                <div class="glass-card pack-card relative overflow-hidden group flex flex-col p-10 h-full transition-all duration-500 hover:-translate-y-2 cursor-pointer" style="background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,244,194,0.3)); border-color: rgba(255,244,194,0.7);">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3" style="background: var(--color-butter-yellow);">
                            <i class="ph-light ph-sparkle text-2xl" style="color: #BFA750;"></i>
                        </div>
                        <span class="text-[0.65rem] uppercase tracking-widest font-bold" style="color: #BFA750;">Guided Reset</span>
                    </div>
                    
                    <h3 class="font-editorial text-2xl font-semibold mb-4">Glow-Up Mental Reset Pack</h3>
                    <p class="text-muted font-light text-sm leading-relaxed mb-10 flex-grow">
                        Rebuild your inner confidence and shed heavy energy with uplifting, daily micro-habits designed for self-love.
                    </p>
                    
                    <button class="w-full py-3.5 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-400 bg-white group-hover:shadow-[0_8px_25px_rgba(255,244,194,0.5)]" style="color: #BFA750; border: 1px solid rgba(191,167,80,0.15);">
                        Explore pack
                    </button>
                </div>

                <!-- Pack 3 -->
                <div class="glass-card pack-card relative overflow-hidden group flex flex-col p-10 h-full transition-all duration-500 hover:-translate-y-2 cursor-pointer" style="background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(220,238,255,0.3)); border-color: rgba(220,238,255,0.7);">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style="background: var(--color-soft-sky-blue);">
                            <i class="ph-light ph-brain text-2xl" style="color: #6A9AC4;"></i>
                        </div>
                        <span class="text-[0.65rem] uppercase tracking-widest font-bold" style="color: #6A9AC4;">Focus & Flow</span>
                    </div>
                    
                    <h3 class="font-editorial text-2xl font-semibold mb-4">Break Overthinking Pack</h3>
                    <p class="text-muted font-light text-sm leading-relaxed mb-10 flex-grow">
                        Clear mental clutter and learn to trust your decisions again through structured cognitive release exercises.
                    </p>
                    
                    <button class="w-full py-3.5 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all duration-400 bg-white group-hover:shadow-[0_8px_25px_rgba(220,238,255,0.45)]" style="color: #6A9AC4; border: 1px solid rgba(106,154,196,0.15);">
                        Start this journey
                    </button>
                </div>

            </div>
        </div>
    </section>
        `;
    }
}
customElements.define('digital-packs-section', DigitalPacksSection);

window.initSubscriptionAnimations = function() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.from(".subscribe-card", {
            scrollTrigger: {
                trigger: ".subscribe-card",
                start: "top 85%",
            },
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8
        });

        gsap.from(".pack-card", {
            scrollTrigger: {
                trigger: ".pack-card",
                start: "top 85%",
            },
            opacity: 0,
            y: 40,
            scale: 0.95,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out"
        });
    }
};
