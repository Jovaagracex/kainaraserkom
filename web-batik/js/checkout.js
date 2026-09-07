/**
 * ============================================================
 * Checkout — Kainara Studio
 * Form checkout + kirim order via WhatsApp
 * ============================================================
 */

/* T() global dari i18n.js — tidak didefinisikan ulang di sini. */

const Checkout = {
    renderSummary() {        const container = document.getElementById('checkoutSummary');
        if (!container) return;
        const items = Cart.getItems();

        container.innerHTML = items.map(item => `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div class="d-flex gap-2 align-items-center">
                    <span class="badge bg-secondary rounded-pill" style="font-size:0.7rem;">${item.qty}x</span>
                    <span style="font-size:0.85rem;">${escHtml(item.nama_produk)}</span>
                </div>
                <span class="fw-semibold" style="font-size:0.85rem;">${window.formatRupiah(item.harga * item.qty)}</span>
            </div>
        `).join('');

        document.getElementById('checkoutTotal').textContent = window.formatRupiah(Cart.getTotal());
    },

    submit() {
        const name = document.getElementById('checkoutName')?.value.trim();
        const phone = document.getElementById('checkoutPhone')?.value.trim();
        const address = document.getElementById('checkoutAddress')?.value.trim();
        const note = document.getElementById('checkoutNote')?.value.trim();

        if (!name || !phone || !address) {
            if (window.showToast) showToast('warning', T('ts_fill'));
            return;
        }
        if (!/^[0-9+\-\s]{9,16}$/.test(phone)) {
            if (window.showToast) showToast('warning', T('ts_phonebad'));
            return;
        }

        const items = Cart.getItems();
        if (items.length === 0) return;
        // Validasi stok akhir sebelum kirim
        for (const it of items) {
            const p = window.catalog?.getById?.(it.id);
            const max = p ? parseInt(p.stok, 10) : Infinity;
            if (!isNaN(max) && it.qty > max) {
                if (window.showToast) showToast('warning', T('ts_over', { name: it.nama_produk, max: max }));
                return;
            }
        }

        const WA_NUMBER = '6285175208067';
        let msg = `*Pesanan Baru — Kainara Studio*\n\n`;
        msg += `*Pembeli:* ${name}\n`;
        msg += `*Telepon:* ${phone}\n`;
        msg += `*Alamat:* ${address}\n`;
        if (note) msg += `*Catatan:* ${note}\n`;
        msg += `\n*Detail Pesanan:*\n`;
        items.forEach((item, i) => {
            msg += `${i + 1}. ${item.nama_produk} (${item.qty}x) — ${window.formatRupiah(item.harga * item.qty)}\n`;
        });
        msg += `\n*Total:* ${window.formatRupiah(Cart.getTotal())}`;

        const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

        // Tutup modal
        const bsModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        if (bsModal) bsModal.hide();

        // Simpan riwayat lalu kosongkan cart
        try { Cart.saveOrder(name); } catch {}
        Cart.clear();

        // Buka WhatsApp
        setTimeout(() => {
            window.open(url, '_blank');
            if (window.showToast) showToast('success', T('ts_sent'));
            // Reset form
            document.getElementById('checkoutForm')?.reset();
        }, 300);
    }
};

window.Checkout = Checkout;
