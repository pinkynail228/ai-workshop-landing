/**
 * JavaScript for AI Tools Workshop Landing Page
 * Handles scroll reveals, dynamic cursor spotlight, and parallax.
 */

document.addEventListener("DOMContentLoaded", () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldDisableMotion = isMobile || prefersReducedMotion;
    const heroVideo = document.querySelector(".hero-video");
    const revealTargets = document.querySelectorAll(".reveal-on-scroll");

    if (isMobile) {
        document.body.classList.add("mobile-optimized");
    }

    if (heroVideo) {
        if (shouldDisableMotion) {
            heroVideo.pause();
            heroVideo.removeAttribute("src");
            heroVideo.load();
        } else {
            const videoSrc = heroVideo.getAttribute("data-src");
            if (videoSrc) {
                heroVideo.src = videoSrc;
                heroVideo.autoplay = true;
                heroVideo.play().catch(() => {
                    /* ignore autoplay failures */
                });
            }
        }
    }

    if (shouldDisableMotion) {
        revealTargets.forEach(el => el.classList.add("is-visible"));
        return;
    }

    // 1. Scroll Reveal Logic
    const revealOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    };
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealTargets.forEach(el => revealObserver.observe(el));

    // 2. Dynamic line animation delay based on flow diagram (Insight section)
    const flowDiagram = document.querySelector('.flow-diagram');
    if (flowDiagram) {
        const diagramObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                document.querySelectorAll('.line-anim').forEach((arrow, index) => {
                    arrow.style.animationDelay = `${(index * 0.5) + 0.5}s`;
                });
            }
        }, { threshold: 0.5 });
        diagramObserver.observe(flowDiagram);
    }

    // 3. Dynamic Cursor Spotlight & Parallax
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    // Smooth lerp for the spotlight and parallax
    const lerp = (start, end, factor) => start + (end - start) * factor;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    const ghosts = document.querySelectorAll('.hero-ghost-element');

    // Check if device supports hover (disables effect on mobile/touch)
    const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

    const tick = () => {
        // Only run interactive logic on non-touch screens
        if (!isTouchDevice) {
            currentX = lerp(currentX, targetX, 0.05);
            currentY = lerp(currentY, targetY, 0.05);

            // Update body custom properties for global ambient glow spotlight
            document.body.style.setProperty('--mouse-x', `${currentX}px`);
            document.body.style.setProperty('--mouse-y', `${currentY}px`);

            // Calculate normalized coordinates (-1 to 1) for parallax
            const normX = (currentX / window.innerWidth) * 2 - 1;
            const normY = (currentY / window.innerHeight) * 2 - 1;

            if (ghosts.length > 0) {
                // First ghost: moves slightly opposite
                if (ghosts[0]) ghosts[0].style.transform = `translate(${normX * -30}px, ${normY * -30}px) rotate(5deg)`;
                // Second ghost: moves slightly with
                if (ghosts[1]) ghosts[1].style.transform = `translate(${normX * 40}px, ${normY * 40}px) rotate(-3deg)`;
            }
        }

        requestAnimationFrame(tick);
    };

    tick();
});
