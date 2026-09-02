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
            <!-- Desktop View -->
            <tr class="d-none d-md-table-row">
                <td class="td-gambar">
                    <img src="${escHtml(p.image_url || PLACEHOLDER)}" class="rounded object-fit-cover" width="50" height="50" alt="${escHtml(p.nama_produk)}" onerror="this.src='${PLACEHOLDER}'">
                </td>
                <td class="td-info">
                    <div class="fw-bold text-dark text-truncate mb-1" style="max-width:200px;">${escHtml(p.nama_produk)}</div>
                    <div class="text-muted fs-7 text-truncate" style="max-width:200px;">${escHtml(p.deskripsi || '—')}</div>
                </td>
                <td class="td-kategori"><span class="badge bg-light border text-dark">${escHtml(p.kategori || '—')}</span></td>
                <td class="td-harga"><span class="fw-bold" style="color:#D97706;">${window.formatRupiah(p.harga)}</span></td>
                <td class="td-stok"><span class="badge ${stockBadge}">${stockText}</span></td>
                <td class="td-aksi text-end">
                    <button class="btn btn-sm btn-outline-secondary rounded-pill" onclick="editProduct('${p.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteProduct('${p.id}', '${escHtml(p.nama_produk)}')" title="Hapus"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
            <!-- Mobile View -->
            <tr class="d-md-none mobile-card-row">
                <td colspan="6" class="p-0 border-0 d-block w-100">
                    <div class="d-flex flex-column h-100 w-100">
                        <!-- Baris 1: Gambar Thumbnail + Nama Produk (fw-bold) + Badge Kategori -->
                        <div class="d-flex align-items-center gap-3 mb-2 w-100">
                            <img src="${escHtml(p.image_url || PLACEHOLDER)}" class="rounded object-fit-cover flex-shrink-0" width="60" height="60" alt="${escHtml(p.nama_produk)}" onerror="this.src='${PLACEHOLDER}'">
                            <div class="flex-grow-1 overflow-hidden">
                                <div class="fw-bold text-dark text-truncate w-100">${escHtml(p.nama_produk)}</div>
                                <span class="badge bg-light border text-dark mt-1">${escHtml(p.kategori || '—')}</span>
                            </div>
                        </div>
                        <!-- Baris 2: Deskripsi Produk (text-truncate) -->
                        <div class="text-muted fs-7 mb-3 text-truncate w-100">${escHtml(p.deskripsi || '—')}</div>
                        <!-- Baris 3: Info Harga & Stok (justify-content-between) -->
                        <div class="d-flex justify-content-between align-items-center mb-3 w-100">
                            <span class="fw-bold" style="color:#D97706; font-size:1.1rem;">${window.formatRupiah(p.harga)}</span>
                            <span class="badge ${stockBadge}">${stockText}</span>
                        </div>
                        <!-- Baris 4: Tombol Action (Edit & Hapus) berjajar rapi -->
                        <div class="d-flex gap-2 mt-auto w-100">
                            <button class="btn btn-sm btn-outline-secondary rounded-pill flex-fill" onclick="editProduct('${p.id}')"><i class="bi bi-pencil"></i> Edit</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill flex-fill" onclick="deleteProduct('${p.id}', '${escHtml(p.nama_produk)}')"><i class="bi bi-trash"></i> Hapus</button>
                        </div>
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
    document.getElementById('productImageFinal').value = '';
    // Reset preview gambar
    const wrap = document.getElementById('imgPreviewWrap');
    const prev = document.getElementById('imgPreview');
    if (wrap) wrap.style.display = 'none';
    if (prev) prev.src = '';
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
    document.getElementById('productDescription').value = p.deskripsi   || '';

    // Isi URL gambar dan set productImageFinal
    const imgUrl = p.image_url || '';
    document.getElementById('productImage').value      = imgUrl.startsWith('data:') ? '' : imgUrl;
    document.getElementById('productImageFinal').value = imgUrl;

    // Tampilkan preview jika ada gambar
    if (imgUrl) {
        const prev = document.getElementById('imgPreview');
        const wrap = document.getElementById('imgPreviewWrap');
        if (prev) prev.src = imgUrl;
        if (wrap) wrap.style.display = 'flex';
    }

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

    // Ambil nilai gambar: utamakan productImageFinal (Base64/URL dari upload/URL)
    const imageFinal = document.getElementById('productImageFinal')?.value.trim()
                    || document.getElementById('productImage')?.value.trim()
                    || '';

    if (!imageFinal) {
        showAlert('Harap pilih gambar atau masukkan URL gambar!', 'warning');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
        return;
    }

    const productData = {
        nama_produk: document.getElementById('productName').value.trim(),
        kategori:    document.getElementById('productCategory').value,
        harga:       parseFloat(document.getElementById('productPrice').value),
        stok:        parseInt(document.getElementById('productStock').value, 10),
        image_url:   imageFinal,
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

// ════════════════════════════════════════════════════════════
// FITUR UPLOAD GAMBAR LOKAL — Baca File → Base64 → Simpan ke DB
// ════════════════════════════════════════════════════════════

/**
 * Membaca file gambar dari input[type=file] dan mengkonversi ke Base64.
 * Hasil Base64 disimpan di #productImageFinal dan ditampilkan sebagai preview.
 */
window.convertFileToBase64 = function() {
    const fileInput = document.getElementById('productFileInput');
    const file = fileInput?.files?.[0];
    if (!file) return;

    // Batasi ukuran file (maks 2MB agar tidak terlalu besar di database)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
        showAlert('Ukuran file terlalu besar (maks 2MB). Gunakan URL Unsplash sebagai alternatif.', 'warning');
        fileInput.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result; // format: "data:image/jpeg;base64,..."

        // Simpan ke hidden field sebagai sumber gambar final
        document.getElementById('productImageFinal').value = base64;

        // Tampilkan preview
        const prev = document.getElementById('imgPreview');
        const wrap = document.getElementById('imgPreviewWrap');
        if (prev) { prev.src = base64; }
        if (wrap) { wrap.style.display = 'flex'; wrap.style.alignItems = 'center'; }

        // Kosongkan field URL agar tidak konflik
        document.getElementById('productImage').value = '';
    };
    reader.readAsDataURL(file);
};

/**
 * Preview gambar dari URL yang diketik di input URL.
 */
window.previewFromUrl = function() {
    const url = document.getElementById('productImage').value.trim();
    const prev = document.getElementById('imgPreview');
    const wrap = document.getElementById('imgPreviewWrap');

    if (!url) {
        if (wrap) wrap.style.display = 'none';
        document.getElementById('productImageFinal').value = '';
        return;
    }

    // Simpan URL ke hidden field
    document.getElementById('productImageFinal').value = url;

    // Tampilkan preview
    if (prev) { prev.src = url; }
    if (wrap) { wrap.style.display = 'flex'; wrap.style.alignItems = 'center'; }

    // Hapus pilihan file agar tidak konflik
    const fileInput = document.getElementById('productFileInput');
    if (fileInput) fileInput.value = '';
};

/**
 * Hapus input gambar (file dan URL) serta sembunyikan preview.
 */
window.clearImageInput = function() {
    document.getElementById('productFileInput').value   = '';
    document.getElementById('productImage').value       = '';
    document.getElementById('productImageFinal').value  = '';

    const prev = document.getElementById('imgPreview');
    const wrap = document.getElementById('imgPreviewWrap');
    if (prev) prev.src = '';
    if (wrap) wrap.style.display = 'none';
};