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

// ── WOW PACK: preloader, progress, cursor, magnetic, typing, dark, tilt ──
(function () {
    'use strict';
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;

    function paintToggle() {
        const b = document.getElementById('themeToggle');
        if (!b) return;
        b.innerHTML = root.getAttribute('data-theme') === 'dark'
            ? '<i class="bi bi-sun"></i>'
            : '<i class="bi bi-moon"></i>';
    }

    let preHidden = false;
    function hidePreloader() {
        if (preHidden) return;
        preHidden = true;
        const pre = document.getElementById('preloader');
        if (!pre) return;
        pre.classList.add('done');
        setTimeout(() => pre.remove(), 650);
    }
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 2500);

    document.addEventListener('DOMContentLoaded', () => {
        paintToggle();
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('site-theme', next); } catch {}
            paintToggle();
        });

        // Scroll progress
        const bar = document.getElementById('scrollProgress');
        const onScrollProgress = () => {
            if (!bar) return;
            const max = document.body.scrollHeight - window.innerHeight;
            bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        };
        window.addEventListener('scroll', onScrollProgress, { passive: true });
        onScrollProgress();

        // Typing
        const words = ['Batik Tulis Asli.', 'Batik Cap Pilihan.', 'Kemeja & Gaun Premium.'];
        const tEl = document.getElementById('typingTextBatik');
        if (tEl) {
            if (reduced) { tEl.textContent = words[0]; }
            else {
                let wi = 0, ci = 0, del = false;
                (function tick() {
                    const w = words[wi];
                    tEl.textContent = w.slice(0, ci);
                    let speed = del ? 32 : 68;
                    if (!del && ci === w.length) { speed = 1600; del = true; }
                    else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; speed = 350; }
                    else { ci += del ? -1 : 1; }
                    setTimeout(tick, speed);
                })();
            }
        }

        // Custom cursor
        if (fine && !reduced) {
            const dot = document.querySelector('.cursor-dot');
            const ring = document.querySelector('.cursor-ring');
            let mx = -100, my = -100, rx = -100, ry = -100;
            document.addEventListener('mousemove', e => {
                mx = e.clientX; my = e.clientY;
                if (dot) dot.style.transform = `translate(${mx - 3.5}px,${my - 3.5}px)`;
            });
            (function loop() {
                rx += (mx - rx) * 0.16;
                ry += (my - ry) * 0.16;
                if (ring) {
                    const half = ring.classList.contains('grow') ? 27 : 17;
                    ring.style.transform = `translate(${rx - half}px,${ry - half}px)`;
                }
                requestAnimationFrame(loop);
            })();
            const sel = 'a, button, [data-tilt], input, select, textarea';
            document.addEventListener('mouseover', e => { if (e.target.closest(sel)) ring?.classList.add('grow'); });
            document.addEventListener('mouseout', e => { if (e.target.closest(sel)) ring?.classList.remove('grow'); });
        }

        // Magnetic
        if (fine && !reduced) {
            document.querySelectorAll('.magnetic').forEach(btn => {
                btn.addEventListener('mousemove', e => {
                    const r = btn.getBoundingClientRect();
                    const x = (e.clientX - r.left - r.width / 2) * 0.18;
                    const y = (e.clientY - r.top - r.height / 2) * 0.28;
                    btn.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
                });
                btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
            });
        }

        // 3D tilt (delegasi: kartu produk dirender dinamis)
        if (fine && !reduced) {
            let tiltEl = null;
            document.addEventListener('mousemove', e => {
                const t = e.target.closest ? e.target.closest('[data-tilt]') : null;
                if (t !== tiltEl) {
                    if (tiltEl) tiltEl.style.transform = '';
                    tiltEl = t;
                }
                if (!tiltEl) return;
                const r = tiltEl.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                tiltEl.style.transition = 'transform .12s ease-out';
                tiltEl.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-3px)`;
            });
            document.addEventListener('mouseleave', () => {
                if (tiltEl) { tiltEl.style.transform = ''; tiltEl = null; }
            }, true);
        }
    });
})();
