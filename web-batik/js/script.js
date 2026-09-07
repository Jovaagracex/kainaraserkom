// ── Toast Helper (SweetAlert2 Mixin) ──────────────────────────
const showToast = (icon, title) => {
    if (typeof Swal === 'undefined') return;
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
    Toast.fire({ icon, title });
};
window.showToast = showToast;

document.addEventListener('DOMContentLoaded', () => {
    const navPill = document.querySelector('.nav-active-pill');
    const navLinks = document.querySelectorAll('.nav-pills .nav-link');

    if (!navPill || navLinks.length === 0) return;

    let isClickNav = false;
    let clickNavTimer = null;

    // Awalnya sembunyikan pill sampai posisi awal siap
    navPill.style.opacity = '0';
    navPill.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.35s cubic-bezier(0.25, 1, 0.5, 1), height 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease';

    function moveNavPill(el) {
        if (!el || !navPill) return;
        const container = navPill.parentElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        if (elRect.width === 0 || elRect.height === 0) return;

        const left = elRect.left - containerRect.left;
        const top = elRect.top - containerRect.top;

        navPill.style.opacity = '1';
        navPill.style.width  = `${elRect.width}px`;
        navPill.style.height = `${elRect.height}px`;
        navPill.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    }

    function clearActive() {
        navLinks.forEach(l => l.classList.remove('active'));
    }

    function setActiveByHref(href, force = false) {
        if (isClickNav && !force) return;
        const link = document.querySelector(`.nav-pills .nav-link[href="${href}"]`);
        if (link) {
            if (link.classList.contains('active')) {
                moveNavPill(link);
                return;
            }
            clearActive();
            link.classList.add('active');
            moveNavPill(link);
        }
    }

    // ── KLIK MENU → tampilkan pill langsung & kunci scrollspy sementara ──
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            isClickNav = true;
            if (clickNavTimer) clearTimeout(clickNavTimer);

            clearActive();
            this.classList.add('active');
            moveNavPill(this);

            clickNavTimer = setTimeout(() => {
                isClickNav = false;
                onScroll();
            }, 850);
        });
    });

    // ── RESIZE → reposition tanpa animasi lag ──
    window.addEventListener('resize', () => {
        const active = document.querySelector('.nav-pills .nav-link.active');
        if (active) {
            navPill.style.transition = 'none';
            moveNavPill(active);
            requestAnimationFrame(() => {
                navPill.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), width 0.35s cubic-bezier(0.25, 1, 0.5, 1), height 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease';
            });
        }
    });

    // Target section dari link navigasi
    const targetIds = Array.from(navLinks).map(link => link.getAttribute('href')?.replace('#', '')).filter(Boolean);
    const allObserved = Array.from(new Set(targetIds)).map(id => document.getElementById(id)).filter(Boolean);

    // ── SCROLL SPY BERDASARKAN POSISI SCROLL SEBENARNYA ──
    function onScroll() {
        const nav = document.getElementById('mainNav');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);

        if (isClickNav) return;

        const scrollPos = window.scrollY + 150;
        let activeTarget = null;

        for (let i = allObserved.length - 1; i >= 0; i--) {
            const el = allObserved[i];
            if (el && el.offsetTop <= scrollPos) {
                activeTarget = el;
                break;
            }
        }

        if (activeTarget) {
            setActiveByHref(`#${activeTarget.id}`);
        } else {
            setActiveByHref('#beranda');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Inisialisasi awal saat pertama dimuat
    setTimeout(() => {
        const defaultActive = document.querySelector('.nav-pills .nav-link.active') || navLinks[0];
        if (defaultActive) {
            defaultActive.classList.add('active');
            moveNavPill(defaultActive);
        }
        onScroll();
    }, 50);
});

// ── Back to top + Cookie consent ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const btt = document.getElementById('backToTop');
    const onScrollBtt = () => { if (btt) btt.classList.toggle('show', window.scrollY > 600); };
    window.addEventListener('scroll', onScrollBtt, { passive: true });
    onScrollBtt();
    btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    try {
        if (!localStorage.getItem('kainara_cookie_ok')) {
            const banner = document.getElementById('cookieBanner');
            if (banner) banner.style.display = 'flex';
        }
    } catch {}
    document.getElementById('cookieOk')?.addEventListener('click', () => {
        try { localStorage.setItem('kainara_cookie_ok', '1'); } catch {}
        const banner = document.getElementById('cookieBanner');
        if (banner) banner.style.display = 'none';
    });
});

// ── Auto-close navbar mobile setelah link diklik ──
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const link = e.target.closest ? e.target.closest('#batikNav .nav-link') : null;
        if (!link) return;
        const nav = document.getElementById('batikNav');
        if (nav && nav.classList.contains('show') && window.bootstrap) {
            bootstrap.Collapse.getOrCreateInstance(nav).hide();
        }
    });

    // ── Indikator offline ──
    const offBar = document.getElementById('offlineBar');
    const syncOffline = () => { if (offBar) offBar.style.display = navigator.onLine ? 'none' : 'flex'; };
    window.addEventListener('online', syncOffline);
    window.addEventListener('offline', syncOffline);
    syncOffline();

    // ── Fail-Safe Pembersihan Backdrop Modal & Offcanvas ──
    document.addEventListener('hidden.bs.modal', () => {
        if (!document.querySelector('.modal.show')) {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    });

    document.addEventListener('hidden.bs.offcanvas', () => {
        if (!document.querySelector('.offcanvas.show')) {
            document.querySelectorAll('.offcanvas-backdrop').forEach(el => el.remove());
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    });
});

// ── Entrance hero + reveal scroll ──
document.addEventListener('DOMContentLoaded', () => {
    const calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1) Hero toko muncul berurutan saat halaman dimuat
    document.querySelectorAll('.hero-content > *, .hero-img-col').forEach((el, i) => {
        if (calmMotion) return;
        el.classList.add('hero-enter');
        el.style.setProperty('--rd', (0.08 + i * 0.1).toFixed(2) + 's');
    });

    // 2) Elemen section muncul lembut saat di-scroll
    const rvSel = '.section-head, .step-card, .about-img-col, .about-text, ' +
        '.promo-banner-section .container, #kontak .section-head';
    const rvEls = document.querySelectorAll(rvSel);

    if (calmMotion || !('IntersectionObserver' in window)) {
        rvEls.forEach((el) => el.classList.add('in'));
    } else {
        const rvObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('in');
                rvObserver.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

        rvEls.forEach((el) => {
            const sibs = Array.from(el.parentElement.children);
            el.style.transitionDelay = (Math.min(sibs.indexOf(el), 3) * 0.08) + 's';
            el.classList.add('rv');
            rvObserver.observe(el);
        });
    }

});

// ── Dark mode + scroll progress ──
(function () {
    'use strict';
    const root = document.documentElement;

    function paintToggle() {
        const b = document.getElementById('themeToggle');
        if (!b) return;
        b.innerHTML = root.getAttribute('data-theme') === 'dark'
            ? '<i class="bi bi-sun"></i>'
            : '<i class="bi bi-moon"></i>';
    }

    document.addEventListener('DOMContentLoaded', () => {
        paintToggle();
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('site-theme', next); } catch {}
            paintToggle();
        });

        const bar = document.getElementById('scrollProgress');
        const onScrollProgress = () => {
            if (!bar) return;
            const max = document.body.scrollHeight - window.innerHeight;
            bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        };
        window.addEventListener('scroll', onScrollProgress, { passive: true });
        onScrollProgress();

        // Loading transisi: ke portofolio & ke panel admin (tampil loader + persen, baru pindah)
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.addEventListener('click', (e) => {
            const a = e.target.closest ? e.target.closest('a[href*="web-portofolio"], a[href*="admin.html"]') : null;
            if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
            const href = a.getAttribute('href');
            if (!href || reducedMotion) return; // biarkan pindah biasa
            e.preventDefault();
            const loader = document.getElementById('pageLoader');
            if (!loader) { window.location.href = href; return; }
            const sub = loader.querySelector('.loader-sub');
            if (sub) sub.textContent = /admin/i.test(href) ? 'Membuka panel admin...' : 'Membuka portofolio...';
            const fill = loader.querySelector('.loader-bar span');
            const pct = loader.querySelector('.loader-pct');
            loader.classList.add('show');
            const DUR = 800;
            let start = null;
            const step = (ts) => {
                if (!start) start = ts;
                const p = Math.min((ts - start) / DUR, 1);
                const eased = 1 - Math.pow(1 - p, 2);
                if (fill) fill.style.width = (eased * 100).toFixed(0) + '%';
                if (pct) pct.textContent = (eased * 100).toFixed(0) + '%';
                if (p < 1) requestAnimationFrame(step);
                else window.location.href = href;
            };
            requestAnimationFrame(step);
        });
    });
})();
