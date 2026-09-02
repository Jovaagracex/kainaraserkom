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

    function setActiveByHref(href) {
        const link = document.querySelector(`.navbar-nav .nav-link[href="${href}"]`);
        if (link) {
            clearActive();
            link.classList.add('active');
            moveNavPill(link);
        }
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
    // Observasi #beranda + semua section[id]
    const heroEl = document.getElementById('beranda');
    const sections = document.querySelectorAll('main > section[id]');
    const allObserved = [heroEl, ...sections].filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        let best = null;
        let bestRatio = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
                best = entry.target;
                bestRatio = entry.intersectionRatio;
            }
        });
        if (best) {
            setActiveByHref(`#${best.id}`);
        }
    }, {
        threshold: [0, 0.15, 0.3, 0.5, 0.7, 1],
        rootMargin: '-5% 0px -60% 0px'
    });

    allObserved.forEach(s => observer.observe(s));

    // ── SCROLL → cek posisi hero ──
    function onScroll() {
        // navbar shadow
        const nav = document.getElementById('mainNav');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);

        // Jika masih di atas hero → set Beranda aktif
        if (heroEl) {
            const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
            if (window.scrollY + 120 < heroBottom) {
                setActiveByHref('#beranda');
                return;
            }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Trigger sekali saat load
    onScroll();
});
