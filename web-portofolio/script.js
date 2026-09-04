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

        // Loading transisi ke web toko: tampilkan loader + persen, baru pindah
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.addEventListener('click', function (e) {
            var a = e.target.closest ? e.target.closest('a[href*="web-batik"]') : null;
            if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
            var href = a.getAttribute('href');
            if (!href || reducedMotion) return; // biarkan pindah biasa
            e.preventDefault();
            var loader = document.getElementById('pageLoader');
            if (!loader) { window.location.href = href; return; }
            var fill = loader.querySelector('.loader-bar span');
            var pct = loader.querySelector('.loader-pct');
            loader.classList.add('show');
            var start = null, DUR = 800;
            function step(ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / DUR, 1);
                var eased = 1 - Math.pow(1 - p, 2); // cepat di awal, melambat di akhir
                if (fill) fill.style.width = (eased * 100).toFixed(0) + '%';
                if (pct) pct.textContent = (eased * 100).toFixed(0) + '%';
                if (p < 1) requestAnimationFrame(step);
                else window.location.href = href;
            }
            requestAnimationFrame(step);
        });
    });
})();
