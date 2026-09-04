/**
 * Portfolio Script — Erlangga
 * - Dark mode toggle (tersimpan di localStorage)
 * - Scroll progress bar
 */

(function () {
    'use strict';

    var root = document.documentElement;

    function paintToggle() {
        var b = document.getElementById('themeToggle');
        if (!b) return;
        b.innerHTML = root.getAttribute('data-theme') === 'dark'
            ? '<i class="bi bi-sun"></i>'
            : '<i class="bi bi-moon"></i>';
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Tema awal sudah dipasang inline di <head> (anti kedip),
        // di sini tinggal sinkronkan ikon + pasang listener.
        paintToggle();
        document.getElementById('themeToggle')?.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('site-theme', next); } catch (e) {}
            paintToggle();
        });

        // Garis progres scroll
        var bar = document.getElementById('scrollProgress');
        function updateBar() {
            if (!bar) return;
            var max = document.body.scrollHeight - window.innerHeight;
            bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        }
        window.addEventListener('scroll', updateBar, { passive: true });
        updateBar();

        // Transisi keluar ke web toko: tahan klik, naikkan wipe, baru pindah
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.addEventListener('click', function (e) {
            var a = e.target.closest ? e.target.closest('a[href*="web-batik"]') : null;
            if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
            var href = a.getAttribute('href');
            if (!href || reducedMotion) return; // biarkan pindah biasa
            e.preventDefault();
            var wipe = document.getElementById('pageWipe');
            if (!wipe) { window.location.href = href; return; }
            wipe.classList.add('show');
            setTimeout(function () { window.location.href = href; }, 620);
        });
    });
})();
