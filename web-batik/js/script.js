document.addEventListener('DOMContentLoaded', () => {
    const navPill = document.querySelector('.nav-active-pill');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarNav = document.querySelector('.navbar-nav');

    if (!navPill || navLinks.length === 0 || !navbarNav) return;

    // Sembunyikan pill di awal load (saat di hero / scroll 0)
    navPill.style.opacity = '0';

    function moveNavPill(activeLink) {
        if (!activeLink) return;
        navPill.style.opacity = '1';
        navPill.style.width = `${activeLink.offsetWidth}px`;
        navPill.style.height = `${activeLink.offsetHeight}px`;
        navPill.style.transform = `translate(${activeLink.offsetLeft}px, ${activeLink.offsetTop}px)`;
    }

    function hideNavPill() {
        navPill.style.opacity = '0';
        navLinks.forEach(l => l.classList.remove('active'));
    }

    function clearActive() {
        navLinks.forEach(l => l.classList.remove('active'));
    }

    // Click handler — paksa tampilkan pill saat user klik menu
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            moveNavPill(this);
        });
    });

    // Resize handler — reposition pill tanpa animasi
    window.addEventListener('resize', () => {
        const active = document.querySelector('.navbar-nav .nav-link.active');
        if (active) {
            navPill.style.transition = 'none';
            moveNavPill(active);
            setTimeout(() => { navPill.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)'; }, 50);
        }
    });

    // Scroll-based active state via IntersectionObserver
    const heroEl = document.querySelector('.catalog-hero');
    const sections = document.querySelectorAll('main > section[id]');

    const observer = new IntersectionObserver((entries) => {
        // Cek apakah hero masih terlihat
        const heroVisible = heroEl && heroEl.getBoundingClientRect().top < window.innerHeight * 0.5;

        if (heroVisible) {
            // Hero aktif → sembunyikan pill, hapus semua active
            hideNavPill();
            return;
        }

        // Cari section yang paling terlihat
        let activeSection = null;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeSection = entry.target;
            }
        });

        if (activeSection) {
            const link = document.querySelector(`.navbar-nav .nav-link[href="#${activeSection.id}"]`);
            if (link) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                moveNavPill(link);
            }
        }
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
    if (heroEl) observer.observe(heroEl);

    // Scroll handler — navbar shadow + cek posisi hero
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('mainNav');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);

        // Jika scroll masih di atas hero, sembunyikan pill
        if (heroEl) {
            const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
            if (window.scrollY + window.innerHeight * 0.4 < heroBottom) {
                hideNavPill();
            }
        } else {
            // Tanpa hero, gunakan threshold sederhana
            if (window.scrollY < 100) hideNavPill();
        }
    });

    // Trigger sekali saat load untuk cek posisi awal
    window.dispatchEvent(new Event('scroll'));
});
