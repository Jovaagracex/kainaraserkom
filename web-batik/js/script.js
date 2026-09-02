document.addEventListener('DOMContentLoaded', () => {
    const navPill = document.querySelector('.nav-active-pill');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarNav = document.querySelector('.navbar-nav');

    if (!navPill || navLinks.length === 0 || !navbarNav) return;

    function moveNavPill(activeLink) {
        if (!activeLink) return;
        navPill.style.opacity = '1';
        navPill.style.width = `${activeLink.offsetWidth}px`;
        navPill.style.height = `${activeLink.offsetHeight}px`;
        navPill.style.transform = `translate(${activeLink.offsetLeft}px, ${activeLink.offsetTop}px)`;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            moveNavPill(this);
        });
    });

    window.addEventListener('resize', () => {
        const active = document.querySelector('.navbar-nav .nav-link.active');
        if (active) {
            navPill.style.transition = 'none';
            moveNavPill(active);
            setTimeout(() => { navPill.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)'; }, 50);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const link = document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`);
                if (link) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    moveNavPill(link);
                }
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

    document.querySelectorAll('main > section[id], header').forEach(s => observer.observe(s));

    setTimeout(() => {
        const active = document.querySelector('.navbar-nav .nav-link.active') || navLinks[0];
        if (active) moveNavPill(active);
    }, 100);

    window.addEventListener('scroll', () => {
        const nav = document.getElementById('mainNav');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    });
});
