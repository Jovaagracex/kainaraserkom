document.addEventListener('DOMContentLoaded', () => {
    const navPill = document.querySelector('.nav-active-pill');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarNav = document.querySelector('.navbar-nav');
    const sections = document.querySelectorAll('main > section, header');

    if (!navPill || navLinks.length === 0 || !navbarNav) return;

    // ── 1. Function to move the pill ──
    function moveNavPill(activeLink) {
        if (!activeLink) return;

        // Make sure the pill is visible
        navPill.style.opacity = '1';

        // Get dimensions relative to the navbar-nav container
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = navbarNav.getBoundingClientRect();

        // Calculate offset (scroll-safe if navbar-nav is scrollable, but here it's flex)
        const offsetLeft = activeLink.offsetLeft;
        const offsetTop = activeLink.offsetTop;
        const offsetWidth = activeLink.offsetWidth;
        const offsetHeight = activeLink.offsetHeight;

        navPill.style.width = `${offsetWidth}px`;
        navPill.style.height = `${offsetHeight}px`;
        navPill.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    }

    // ── 2. Click events ──
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Update active class
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Move pill
            moveNavPill(this);
        });
    });

    // ── 3. Resize event ──
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.navbar-nav .nav-link.active');
        if (activeLink) {
            // Disable transition temporarily for instant resize adjustment
            navPill.style.transition = 'none';
            moveNavPill(activeLink);
            // Re-enable transition
            setTimeout(() => {
                navPill.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 50);
        }
    });

    // ── 4. IntersectionObserver for scroll spy ──
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is halfway in viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find matching link based on section id
                const sectionId = entry.target.id;
                // Special case: header -> #produk for 'Katalog' link
                const targetId = sectionId === 'produk' || entry.target.tagName === 'HEADER' ? 'produk' : sectionId;
                
                const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${targetId}"]`);
                
                if (activeLink) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    activeLink.classList.add('active');
                    moveNavPill(activeLink);
                }
            }
        });
    }, observerOptions);

    // Observe all sections and header
    sections.forEach(section => {
        observer.observe(section);
    });
    
    const heroHeader = document.querySelector('header');
    if (heroHeader) {
        observer.observe(heroHeader);
    }

    // Initialize pill position on load (after a short delay to ensure fonts/layout are loaded)
    setTimeout(() => {
        const activeLink = document.querySelector('.navbar-nav .nav-link.active') || navLinks[0];
        if (activeLink) {
            moveNavPill(activeLink);
        }
    }, 100);
});
