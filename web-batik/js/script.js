document.addEventListener('DOMContentLoaded', () => {
    // ── Navbar scroll effect ──
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 30);
        });
    }
});
