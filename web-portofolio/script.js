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
    });
})();
