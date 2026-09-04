/**
 * WOW PACK — Erlangga Portfolio
 * Preloader, scroll progress, custom cursor, magnetic buttons,
 * typing animation, dark mode, 3D tilt cards.
 * Nonaktif otomatis di perangkat sentuh & prefers-reduced-motion.
 */
(function () {
    'use strict';

    var fine = window.matchMedia('(pointer: fine)').matches;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var root = document.documentElement;

    /* ── Dark mode ── */
    function paintToggle() {
        var b = document.getElementById('themeToggle');
        if (!b) return;
        b.innerHTML = root.getAttribute('data-theme') === 'dark'
            ? '<i class="bi bi-sun"></i>'
            : '<i class="bi bi-moon"></i>';
    }
    window.setTheme = function (t) {
        root.setAttribute('data-theme', t);
        try { localStorage.setItem('site-theme', t); } catch (e) {}
        paintToggle();
    };

    /* ── Preloader ── */
    var preHidden = false;
    function hidePreloader() {
        if (preHidden) return;
        preHidden = true;
        var pre = document.getElementById('preloader');
        if (!pre) return;
        pre.classList.add('done');
        setTimeout(function () { pre.remove(); }, 650);
    }
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 2500); // fallback

    document.addEventListener('DOMContentLoaded', function () {
        paintToggle();
        document.getElementById('themeToggle')?.addEventListener('click', function () {
            window.setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });

        /* ── Scroll progress ── */
        var bar = document.getElementById('scrollProgress');
        function onScrollProgress() {
            if (!bar) return;
            var max = document.body.scrollHeight - window.innerHeight;
            bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        }
        window.addEventListener('scroll', onScrollProgress, { passive: true });
        onScrollProgress();

        /* ── Typing animation ── */
        var words = [
            'website modern & responsif.',
            'aplikasi CRUD full-stack.',
            'pengalaman web yang berkesan.'
        ];
        var tEl = document.getElementById('typingText');
        if (tEl) {
            if (reduced) {
                tEl.textContent = words[0];
            } else {
                var wi = 0, ci = 0, del = false;
                (function tick() {
                    var w = words[wi];
                    tEl.textContent = w.slice(0, ci);
                    var speed = del ? 32 : 68;
                    if (!del && ci === w.length) { speed = 1600; del = true; }
                    else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; speed = 350; }
                    else { ci += del ? -1 : 1; }
                    setTimeout(tick, speed);
                })();
            }
        }

        /* ── Custom cursor (desktop presisi) ── */
        if (fine && !reduced) {
            var dot = document.querySelector('.cursor-dot');
            var ring = document.querySelector('.cursor-ring');
            var mx = -100, my = -100, rx = -100, ry = -100;
            document.addEventListener('mousemove', function (e) {
                mx = e.clientX; my = e.clientY;
                if (dot) dot.style.transform = 'translate(' + (mx - 3.5) + 'px,' + (my - 3.5) + 'px)';
            });
            (function loop() {
                rx += (mx - rx) * 0.16;
                ry += (my - ry) * 0.16;
                if (ring) {
                    var half = ring.classList.contains('grow') ? 27 : 17;
                    ring.style.transform = 'translate(' + (rx - half) + 'px,' + (ry - half) + 'px)';
                }
                requestAnimationFrame(loop);
            })();
            document.addEventListener('mouseover', function (e) {
                if (e.target.closest('a, button, [data-tilt], input, select, textarea')) {
                    ring?.classList.add('grow');
                }
            });
            document.addEventListener('mouseout', function (e) {
                if (e.target.closest('a, button, [data-tilt], input, select, textarea')) {
                    ring?.classList.remove('grow');
                }
            });
        }

        /* ── Magnetic buttons ── */
        if (fine && !reduced) {
            document.querySelectorAll('.magnetic').forEach(function (btn) {
                btn.addEventListener('mousemove', function (e) {
                    var r = btn.getBoundingClientRect();
                    var x = (e.clientX - r.left - r.width / 2) * 0.18;
                    var y = (e.clientY - r.top - r.height / 2) * 0.28;
                    btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
                });
                btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
            });
        }

        /* ── 3D tilt cards (delegasi: aman untuk konten dinamis) ── */
        if (fine && !reduced) {
            var tiltEl = null;
            document.addEventListener('mousemove', function (e) {
                var t = e.target.closest ? e.target.closest('[data-tilt]') : null;
                if (t !== tiltEl) {
                    if (tiltEl) tiltEl.style.transform = '';
                    tiltEl = t;
                }
                if (!tiltEl) return;
                var r = tiltEl.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width - 0.5;
                var y = (e.clientY - r.top) / r.height - 0.5;
                tiltEl.style.transition = 'transform .12s ease-out';
                tiltEl.style.transform = 'perspective(900px) rotateX(' + (-y * 7).toFixed(2) +
                    'deg) rotateY(' + (x * 7).toFixed(2) + 'deg) translateY(-3px)';
            });
            document.addEventListener('mouseleave', function () {
                if (tiltEl) { tiltEl.style.transform = ''; tiltEl = null; }
            }, true);
        }
    });
})();
