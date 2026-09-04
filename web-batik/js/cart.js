/**
 * ============================================================
 * Cart System — Kainara Studio (v2: delegasi aman + validasi stok)
 * ============================================================
 */

const CART_KEY = 'kainara_cart';
const ORDER_KEY = 'kainara_orders';

function cartStockOf(id) {
    const p = window.catalog?.getById?.(id);
    const s = p ? parseInt(p.stok, 10) : NaN;
    return isNaN(s) ? Infinity : s;
}

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
        qty = Math.max(1, parseInt(qty, 10) || 1);
        const stock = parseInt(product.stok, 10);
        const maxStock = isNaN(stock) ? Infinity : stock;
        if (maxStock <= 0) {
            if (window.showToast) showToast('warning', 'Stok produk habis!');
            return;
        }
        const items = this.getItems();
        const existing = items.find(i => String(i.id) === String(product.id));
        const curQty = existing ? existing.qty : 0;
        if (curQty + qty > maxStock) {
            if (window.showToast) showToast('warning', `Stok tersisa ${maxStock} pcs!`);
            if (existing) existing.qty = maxStock;
            else items.push({
                id: product.id,
                nama_produk: product.nama_produk,
                harga: Number(product.harga) || 0,
                image_url: product.image_url || '',
                kategori: product.kategori || '',
                stok: maxStock,
                qty: maxStock
            });
            this.save(items);
            return;
        }
        if (existing) {
            existing.qty += qty;
        } else {
            items.push({
                id: product.id,
                nama_produk: product.nama_produk,
                harga: Number(product.harga) || 0,
                image_url: product.image_url || '',
                kategori: product.kategori || '',
                stok: maxStock === Infinity ? 9999 : maxStock,
                qty
            });
        }
        this.save(items);
        if (window.showToast) showToast('success', `"${product.nama_produk}" ditambahkan ke keranjang!`);
    },

    removeItem(id) {
        this.save(this.getItems().filter(i => String(i.id) !== String(id)));
    },

    updateQty(id, qty) {
        qty = parseInt(qty, 10) || 1;
        const items = this.getItems();
        const item = items.find(i => String(i.id) === String(id));
        if (!item) return;
        const maxStock = cartStockOf(id);
        if (qty > maxStock) {
            if (window.showToast) showToast('warning', `Maksimal ${maxStock} pcs (stok tersedia)!`);
            qty = maxStock;
        }
        item.qty = Math.max(1, qty);
        this.save(items);
    },

    getTotal() {
        return this.getItems().reduce((sum, i) => sum + ((Number(i.harga) || 0) * (i.qty || 0)), 0);
    },

    getCount() {
        return this.getItems().reduce((sum, i) => sum + (i.qty || 0), 0);
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
            badge.classList.toggle('d-none', count <= 0);
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    updatePanel() {
        const panel = document.getElementById('cartPanelBody');
        if (!panel) return;
        const items = this.getItems();

        const footer = document.getElementById('cartPanelFooter');
        if (items.length === 0) {
            panel.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="bi bi-bag fs-1 d-block mb-2"></i>
                    <p>Keranjang kosong</p>
                </div>
                ${this.historyHtml()}`;
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
                    <div class="d-flex align-items-center gap-2 mt-1" data-cart-row="${escHtml(item.id)}">
                        <button class="btn btn-sm btn-outline-secondary rounded-circle" style="width:26px;height:26px;padding:0;" data-cart="dec" aria-label="Kurangi">
                            <i class="bi bi-dash" style="font-size:0.7rem;"></i>
                        </button>
                        <span class="fw-semibold" style="font-size:0.85rem;min-width:20px;text-align:center;">${item.qty}</span>
                        <button class="btn btn-sm btn-outline-secondary rounded-circle" style="width:26px;height:26px;padding:0;" data-cart="inc" aria-label="Tambah">
                            <i class="bi bi-plus" style="font-size:0.7rem;"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-auto" style="font-size:0.7rem;padding:2px 6px;" data-cart="del" aria-label="Hapus">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('') + this.historyHtml();

        if (footer) {
            footer.style.display = 'block';
            const t = document.getElementById('cartTotal');
            if (t) t.textContent = window.formatRupiah(this.getTotal());
        }
    },

    historyHtml() {
        let orders = [];
        try { orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || []; } catch { orders = []; }
        if (!orders.length) return '';
        return `
            <div class="mt-4">
                <h6 class="fw-bold small text-muted">Riwayat Pesanan (${orders.length})</h6>
                ${orders.slice(0, 3).map(o => `
                    <div class="small border rounded-3 p-2 mb-2">
                        <div class="fw-semibold">${escHtml(o.date || '')} — ${escHtml(o.name || '')}</div>
                        <div class="text-muted">${(o.items || []).length} item • ${window.formatRupiah(o.total || 0)}</div>
                    </div>`).join('')}
            </div>`;
    },

    saveOrder(name) {
        const items = this.getItems();
        if (!items.length) return;
        let orders = [];
        try { orders = JSON.parse(localStorage.getItem(ORDER_KEY)) || []; } catch { orders = []; }
        orders.unshift({
            date: new Date().toISOString().slice(0, 10),
            name: name || 'Pembeli',
            items: items.map(i => ({ id: i.id, nama_produk: i.nama_produk, qty: i.qty, harga: i.harga })),
            total: this.getTotal()
        });
        localStorage.setItem(ORDER_KEY, JSON.stringify(orders.slice(0, 20)));
    },

    openPanel() {
        this.updatePanel();
        new bootstrap.Offcanvas(document.getElementById('cartOffcanvas')).show();
    },

    checkout() {
        // Validasi stok sebelum checkout
        const items = this.getItems();
        if (items.length === 0) {
            if (window.showToast) showToast('warning', 'Keranjang kosong!');
            return;
        }
        for (const it of items) {
            const max = cartStockOf(it.id);
            if (it.qty > max) {
                if (window.showToast) showToast('warning', `"${it.nama_produk}" melebihi stok (${max})!`);
                return;
            }
        }
        bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'))?.hide();
        setTimeout(() => {
            window.Checkout?.renderSummary?.();
            new bootstrap.Modal(document.getElementById('checkoutModal')).show();
        }, 300);
    }
};

window.Cart = Cart;

document.addEventListener('DOMContentLoaded', () => {
    Cart.updateBadge();
    // Delegasi tombol cart (aman, tanpa id di inline onclick)
    document.getElementById('cartPanelBody')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-cart]');
        if (!btn) return;
        const row = e.target.closest('[data-cart-row]');
        const id = row?.dataset.cartRow;
        if (!id) return;
        const items = Cart.getItems();
        const item = items.find(i => String(i.id) === String(id));
        const cur = item ? item.qty : 1;
        const act = btn.dataset.cart;
        if (act === 'inc') Cart.updateQty(id, cur + 1);
        else if (act === 'dec') Cart.updateQty(id, cur - 1);
        else if (act === 'del') Cart.removeItem(id);
    });
});
