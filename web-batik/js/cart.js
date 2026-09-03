/**
 * ============================================================
 * Cart System — Kainara Studio
 * Keranjang belanja menggunakan localStorage
 * ============================================================
 */

const CART_KEY = 'kainara_cart';

const Cart = {
    getItems() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch { return []; }
    },

    save(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        this.updateBadge();
        this.updatePanel();
    },

    addItem(product, qty = 1) {
        const items = this.getItems();
        const existing = items.find(i => String(i.id) === String(product.id));
        if (existing) {
            existing.qty += qty;
        } else {
            items.push({
                id: product.id,
                nama_produk: product.nama_produk,
                harga: product.harga,
                image_url: product.image_url || '',
                kategori: product.kategori || '',
                qty: qty
            });
        }
        this.save(items);
        if (window.showToast) showToast('success', `"${product.nama_produk}" ditambahkan ke keranjang!`);
    },

    removeItem(id) {
        const items = this.getItems().filter(i => String(i.id) !== String(id));
        this.save(items);
    },

    updateQty(id, qty) {
        const items = this.getItems();
        const item = items.find(i => String(i.id) === String(id));
        if (item) {
            item.qty = Math.max(1, qty);
            this.save(items);
        }
    },

    getTotal() {
        return this.getItems().reduce((sum, i) => sum + (i.harga * i.qty), 0);
    },

    getCount() {
        return this.getItems().reduce((sum, i) => sum + i.qty, 0);
    },

    clear() {
        localStorage.removeItem(CART_KEY);
        this.updateBadge();
        this.updatePanel();
    },

    updateBadge() {
        const badge = document.getElementById('cartBadge');
        const count = this.getCount();
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    updatePanel() {
        const panel = document.getElementById('cartPanelBody');
        if (!panel) return;
        const items = this.getItems();

        if (items.length === 0) {
            panel.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-bag fs-1 d-block mb-2"></i>
                    <p>Keranjang kosong</p>
                </div>`;
            const footer = document.getElementById('cartPanelFooter');
            if (footer) footer.style.display = 'none';
            return;
        }

        panel.innerHTML = items.map(item => `
            <div class="d-flex gap-3 py-3 border-bottom">
                <img src="${escHtml(item.image_url || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80&h=80&fit=crop')}" 
                     alt="${escHtml(item.nama_produk)}" 
                     class="rounded" style="width:56px;height:56px;object-fit:cover;">
                <div class="flex-grow-1">
                    <div class="fw-semibold text-dark" style="font-size:0.85rem;">${escHtml(item.nama_produk)}</div>
                    <div style="color:#D97706;font-size:0.8rem;">${window.formatRupiah(item.harga)}</div>
                    <div class="d-flex align-items-center gap-2 mt-1">
                        <button class="btn btn-sm btn-outline-secondary rounded-circle" style="width:26px;height:26px;padding:0;" onclick="Cart.updateQty('${item.id}', ${item.qty - 1})">
                            <i class="bi bi-dash" style="font-size:0.7rem;"></i>
                        </button>
                        <span class="fw-semibold" style="font-size:0.85rem;min-width:20px;text-align:center;">${item.qty}</span>
                        <button class="btn btn-sm btn-outline-secondary rounded-circle" style="width:26px;height:26px;padding:0;" onclick="Cart.updateQty('${item.id}', ${item.qty + 1})">
                            <i class="bi bi-plus" style="font-size:0.7rem;"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-auto" style="font-size:0.7rem;padding:2px 6px;" onclick="Cart.removeItem('${item.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        const footer = document.getElementById('cartPanelFooter');
        if (footer) {
            footer.style.display = 'block';
            document.getElementById('cartTotal').textContent = window.formatRupiah(this.getTotal());
        }
    },

    openPanel() {
        this.updatePanel();
        const bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
        bsOffcanvas.show();
    },

    checkout() {
        const items = this.getItems();
        if (items.length === 0) {
            if (window.showToast) showToast('warning', 'Keranjang kosong!');
            return;
        }
        // Tutup offcanvas dulu
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
        if (bsOffcanvas) bsOffcanvas.hide();
        // Buka modal checkout
        setTimeout(() => {
            const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
            checkoutModal.show();
        }, 300);
    }
};

window.Cart = Cart;

document.addEventListener('DOMContentLoaded', () => {
    Cart.updateBadge();
});
