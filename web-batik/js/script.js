document.addEventListener('DOMContentLoaded', () => {
    const navPill = document.querySelector('.nav-active-pill');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    if (!navPill || navLinks.length === 0) return;

    // Awalnya sembunyikan pill
    navPill.style.opacity = '0';
    navPill.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';

    function moveNavPill(el) {
        if (!el) return;
        navPill.style.opacity = '1';
        navPill.style.width  = el.offsetWidth + 'px';
        navPill.style.height = el.offsetHeight + 'px';
        navPill.style.transform = `translate(${el.offsetLeft}px, ${el.offsetTop}px)`;
    }

    function hidePill() {
        navPill.style.opacity = '0';
    }

    function clearActive() {
        navLinks.forEach(l => l.classList.remove('active'));
    }

    // ── KLIK MENU → tampilkan pill ──
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            clearActive();
            this.classList.add('active');
            moveNavPill(this);
        });
    });

    // ── RESIZE → reposition tanpa animasi ──
    window.addEventListener('resize', () => {
        const active = document.querySelector('.navbar-nav .nav-link.active');
        if (active) {
            navPill.style.transition = 'none';
            moveNavPill(active);
            requestAnimationFrame(() => {
                navPill.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
            });
        }
    });

    // ── SCROLL SPY via IntersectionObserver ──
    const sections = document.querySelectorAll('main > section[id]');

    const observer = new IntersectionObserver((entries) => {
        // Pilih entry yang paling terlihat di viewport
        let best = null;
        let bestRatio = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
                best = entry.target;
                bestRatio = entry.intersectionRatio;
            }
        });

        if (best) {
            const link = document.querySelector(`.navbar-nav .nav-link[href="#${best.id}"]`);
            if (link) {
                clearActive();
                link.classList.add('active');
                moveNavPill(link);
            }
        }
    }, {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -60% 0px'
    });

    sections.forEach(s => observer.observe(s));

    // ── SCROLL → cek apakah masih di hero ──
    function checkHero() {
        const hero = document.querySelector('header, .catalog-hero');
        if (!hero) return;
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const pastHero = window.scrollY + 120 > heroBottom;
        if (!pastHero) {
            hidePill();
            clearActive();
        }
    }

    window.addEventListener('scroll', () => {
        // navbar shadow
        const nav = document.getElementById('mainNav');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
        checkHero();
    }, { passive: true });

    // Jalankan sekali saat load
    checkHero();
});
