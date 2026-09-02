/**
 * ============================================================
 * Admin Panel — Kainara Studio
 * Menggunakan window.supabaseClient (dimuat dari supabaseClient.js)
 * CRUD: Fetch, Add, Edit, Delete produk secara real-time
 * ============================================================
 */

const state = {
    products: [],
    filtered: [],
    editingId: null
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80&h=80&fit=crop';

// ── Load Products dari Supabase ──────────────────────────────
async function loadProducts() {
    try {
        const { data, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        state.products = data || [];
        filterProducts();
    } catch (err) {
        console.error('Error loading products:', err);
        showAlert('Gagal memuat data produk: ' + err.message, 'danger');
    }
}

// ── Render Tabel / Card ──────────────────────────────────────
function renderTable() {
    const tbody = document.getElementById('productTableBody');
    const count = document.getElementById('totalProducts');

    if (count) count.textContent = state.filtered.length;

    if (state.filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-5 text-muted">
            <i class="bi bi-inbox fs-2 d-block mb-2"></i>Belum ada produk.
        </td></tr>`;
        return;
    }

    tbody.innerHTML = state.filtered.map(p => {
        const stockBadge = p.stok > 10 ? 'bg-success' : p.stok > 0 ? 'bg-warning text-dark' : 'bg-danger';
        const stockText  = p.stok > 0 ? `${p.stok} Tersedia` : 'Habis';

        return `
            <tr>
                <td data-label="Gambar" class="td-gambar">
                    <img src="${escHtml(p.image_url || PLACEHOLDER)}"
                         class="rounded object-fit-cover"
                         width="60" height="60"
                         alt="${escHtml(p.nama_produk)}"
                         onerror="this.src='${PLACEHOLDER}'">
                </td>
                <td data-label="Nama Produk" class="td-info">
                    <div class="d-flex justify-content-between align-items-start w-100 mb-1">
                        <div class="fw-semibold text-dark text-truncate pe-2">${escHtml(p.nama_produk)}</div>
                        <span class="badge bg-light border text-dark d-md-none flex-shrink-0">${escHtml(p.kategori || '—')}</span>
                    </div>
                    <div class="text-muted fs-7 mobile-desc">${escHtml(p.deskripsi || '—')}</div>
                </td>
                <td data-label="Kategori" class="td-kategori d-none d-md-table-cell">
                    <span class="badge bg-light border text-dark">${escHtml(p.kategori || '—')}</span>
                </td>
                <td data-label="Harga" class="td-harga">
                    <span class="fw-bold" style="color:#D97706;">${window.formatRupiah(p.harga)}</span>
                </td>
                <td data-label="Stok" class="td-stok">
                    <span class="badge ${stockBadge}">${stockText}</span>
                </td>
                <td data-label="Aksi" class="td-aksi text-md-end">
                    <div class="d-flex gap-2 justify-content-md-end w-100">
                        <button class="btn btn-sm btn-outline-secondary rounded-pill flex-fill flex-md-grow-0"
                                onclick="editProduct('${p.id}')" title="Edit">
                            <i class="bi bi-pencil"></i> <span class="d-md-none">Edit</span>
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-pill flex-fill flex-md-grow-0"
                                onclick="deleteProduct('${p.id}', '${escHtml(p.nama_produk)}')" title="Hapus">
                            <i class="bi bi-trash"></i> <span class="d-md-none">Hapus</span>
                        </button>
                    </div>
                </td>
            </tr>`;
    }).join('');
}

// ── Alert Helper ─────────────────────────────────────────────
function showAlert(msg, type = 'success') {
    const existing = document.getElementById('adminToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = `alert alert-${type} alert-dismissible position-fixed bottom-0 start-50 translate-middle-x mb-3 shadow-sm z-3`;
    toast.style.cssText = 'min-width:260px;max-width:90vw;border-radius:12px;';
    toast.innerHTML = `${msg}<button type="button" class="btn-close ms-3" onclick="this.parentElement.remove()"></button>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ── Filter Produk ─────────────────────────────────────────────
window.filterProducts = function() {
    const query = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
    state.filtered = query
        ? state.products.filter(p =>
            p.nama_produk?.toLowerCase().includes(query) ||
            p.kategori?.toLowerCase().includes(query) ||
            p.deskripsi?.toLowerCase().includes(query))
        : [...state.products];
    renderTable();
};

// ── Reset Form Modal ──────────────────────────────────────────
window.resetForm = function() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').textContent = 'Tambah Produk Baru';
    state.editingId = null;
};

// ── Edit Produk: Isi form & buka modal ───────────────────────
window.editProduct = function(id) {
    const p = state.products.find(p => p.id === id);
    if (!p) return;

    state.editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Produk';
    document.getElementById('productId').value          = p.id;
    document.getElementById('productName').value        = p.nama_produk || '';
    document.getElementById('productCategory').value    = p.kategori    || '';
    document.getElementById('productPrice').value       = p.harga       || '';
    document.getElementById('productStock').value       = p.stok        ?? 0;
    document.getElementById('productImage').value       = p.image_url   || '';
    document.getElementById('productDescription').value = p.deskripsi   || '';

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
};

// ── Hapus Produk ──────────────────────────────────────────────
window.deleteProduct = async function(id, name) {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

    try {
        const { error } = await window.supabaseClient
            .from('products').delete().eq('id', id);
        if (error) throw error;

        showAlert(`Produk "${name}" berhasil dihapus.`, 'success');
        await loadProducts();
    } catch (err) {
        console.error('Error deleting product:', err);
        showAlert('Gagal menghapus: ' + err.message, 'danger');
    }
};

// ── Simpan Produk (Tambah / Edit) ─────────────────────────────
window.handleFormSubmit = async function(e) {
    e.preventDefault();

    const submitBtn   = e.target.querySelector('button[type="submit"]');
    const originalHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Menyimpan...';

    const productData = {
        nama_produk: document.getElementById('productName').value.trim(),
        kategori:    document.getElementById('productCategory').value,
        harga:       parseFloat(document.getElementById('productPrice').value),
        stok:        parseInt(document.getElementById('productStock').value, 10),
        image_url:   document.getElementById('productImage').value.trim(),
        deskripsi:   document.getElementById('productDescription').value.trim() || null,
    };

    try {
        if (state.editingId) {
            const { error } = await window.supabaseClient
                .from('products').update(productData).eq('id', state.editingId);
            if (error) throw error;
            showAlert('Produk berhasil diperbarui!', 'success');
        } else {
            const { error } = await window.supabaseClient
                .from('products').insert([productData]);
            if (error) throw error;
            showAlert('Produk baru berhasil ditambahkan!', 'success');
        }

        // Tutup modal
        const modalEl = document.getElementById('productModal');
        const modal   = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();

        await loadProducts();
    } catch (err) {
        console.error('Error saving product:', err);
        showAlert('Gagal menyimpan: ' + err.message, 'danger');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
    }
};

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadProducts);