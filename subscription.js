// Page transition function
window.transitionTo = function(url) {
    if (typeof gsap !== 'undefined') {
        gsap.to("body", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                window.location.href = url;
            }
        });
    } else {
        window.location.href = url;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Initial Animations
        gsap.from(".hero", { opacity: 0, y: 50, duration: 1 });
        gsap.from(".sub", { opacity: 0, y: 30, delay: 0.3, duration: 1 });

        // Wait for custom elements to render then trigger scroll animations
        Promise.allSettled([
            customElements.whenDefined('pricing-plans-section'),
            customElements.whenDefined('digital-packs-section')
        ]).then(() => {
            // Short timeout to ensure elements are fully upgraded in DOM
            setTimeout(() => {
                if(window.initSubscriptionAnimations) {
                    window.initSubscriptionAnimations();
                    ScrollTrigger.refresh();
                }
            }, 50);
        });

        gsap.to(".parallax-bg", {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        });

        gsap.from("body", { opacity: 0, duration: 1, ease: "power2.out" });
    }
});
