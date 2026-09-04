/**
 * ============================================================
 * Dashboard Admin — Kainara Studio
 * Menggunakan window.supabaseClient (dimuat dari supabaseClient.js)
 * Fitur: statistik klik-untuk-filter, cari, filter kategori,
 * sorting, pagination, stepper stok, export CSV, CRUD + upload.
 * Semua render teks lewat escHtml + delegasi event (anti-XSS).
 * ============================================================
 */

const state = {
    products: [],
    filtered: [],
    editingId: null,
    query: '',
    kategori: '',
    sort: 'terbaru',
    page: 1,
    perPage: 8,
    lowOnly: false,
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=120&h=120&fit=crop';
const LOW_STOCK = 5;

// ── Helper tanggal id ──────────────────────────────────────────
function fmtDate(iso) {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return '—'; }
}

function stockMeta(stok) {
    const s = Number(stok) || 0;
    if (s <= 0)  return { cls: 'out',  text: 'Habis' };
    if (s <= LOW_STOCK) return { cls: 'warn', text: `${s} Menipis` };
    return { cls: 'ok', text: `${s} Tersedia` };
}

// ── Load dari Supabase ─────────────────────────────────────────
async function loadProducts() {
    renderSkeleton();
    try {
        const { data, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        state.products = data || [];
        state.page = 1;
        applyFilters();
    } catch (err) {
        console.error('Error loading products:', err);
        showAlert('Gagal memuat data: ' + err.message, 'danger');
        state.products = [];
        applyFilters();
    }
}

function renderSkeleton() {
    const tbody = document.getElementById('productTableBody');
    if (tbody) {
        tbody.innerHTML = Array.from({ length: 4 })
            .map(() => '<tr class="skel"><td colspan="6"><div class="skel-bar"></div></td></tr>')
            .join('');
    }
    const cards = document.getElementById('productCards');
    if (cards) cards.innerHTML = '';
    const info = document.getElementById('pagerInfo');
    if (info) info.textContent = 'Memuat…';
}

// ── Statistik ──────────────────────────────────────────────────
function renderStats() {
    const list = state.products;
    const totalStok = list.reduce((a, p) => a + (Number(p.stok) || 0), 0);
    const nilai = list.reduce((a, p) => a + (Number(p.harga) || 0) * (Number(p.stok) || 0), 0);
    const menipis = list.filter(p => (Number(p.stok) || 0) <= LOW_STOCK);

    setText('statProdukNum', list.length);
    setText('statStokNum', totalStok);
    setText('statNilaiNum', window.formatRupiah(nilai));
    setText('statMenipisNum', menipis.length);

    const banner = document.getElementById('lowBanner');
    if (banner) {
        const show = menipis.length > 0;
        banner.classList.toggle('show', show);
        if (show) {
            setText('lowBannerText',
                `${menipis.length} produk stoknya ≤ ${LOW_STOCK} — restock sebelum kehabisan.`);
        }
    }
    document.getElementById('statMenipis')?.classList.toggle('active', state.lowOnly);
    document.getElementById('chipLow')?.classList.toggle('show', state.lowOnly);
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ── Opsi kategori dinamis ──────────────────────────────────────
function renderKategoriOptions() {
    const sel = document.getElementById('filterKategori');
    if (!sel) return;
    const cats = [...new Set(state.products.map(p => (p.kategori || '').trim()).filter(Boolean))].sort();
    const cur = state.kategori;
    sel.innerHTML = '<option value="">Semua Kategori</option>' +
        cats.map(c => `<option value="${escHtml(c)}">${escHtml(c)}</option>`).join('');
    if (cats.includes(cur)) sel.value = cur;
}

// ── Filter + sort + paginate ───────────────────────────────────
function applyFilters() {
    const q = state.query.trim().toLowerCase();
    let list = [...state.products];

    if (state.lowOnly) list = list.filter(p => (Number(p.stok) || 0) <= LOW_STOCK);
    if (state.kategori) list = list.filter(p => (p.kategori || '') === state.kategori);
    if (q) {
        list = list.filter(p =>
            (p.nama_produk || '').toLowerCase().includes(q) ||
            (p.kategori || '').toLowerCase().includes(q) ||
            (p.deskripsi || '').toLowerCase().includes(q));
    }

    const byHarga = p => Number(p.harga) || 0;
    const byStok = p => Number(p.stok) || 0;
    switch (state.sort) {
        case 'harga_asc':  list.sort((a, b) => byHarga(a) - byHarga(b)); break;
        case 'harga_desc': list.sort((a, b) => byHarga(b) - byHarga(a)); break;
        case 'stok_asc':   list.sort((a, b) => byStok(a) - byStok(b)); break;
        case 'nama_asc':   list.sort((a, b) => String(a.nama_produk || '').localeCompare(String(b.nama_produk || ''), 'id')); break;
        default:           list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    state.filtered = list;
    const maxPage = Math.max(1, Math.ceil(list.length / state.perPage));
    if (state.page > maxPage) state.page = maxPage;

    renderStats();
    renderKategoriOptions();
    renderTable();
}

// ── Render tabel + kartu mobile + pager ────────────────────────
function renderTable() {
    const tbody = document.getElementById('productTableBody');
    const cards = document.getElementById('productCards');
    const info = document.getElementById('pagerInfo');
    const prev = document.getElementById('btnPrev');
    const next = document.getElementById('btnNext');

    const total = state.filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / state.perPage));
    const start = (state.page - 1) * state.perPage;
    const items = state.filtered.slice(start, start + state.perPage);

    if (info) {
        info.textContent = total === 0
            ? 'Tidak ada produk'
            : `Menampilkan ${start + 1}–${start + items.length} dari ${total} produk`;
    }
    if (prev) prev.disabled = state.page <= 1;
    if (next) next.disabled = state.page >= maxPage;
    [prev, next].forEach(b => { if (b) b.style.opacity = b.disabled ? '.45' : '1'; });

    if (total === 0) {
        const isFiltered = state.query || state.kategori || state.lowOnly;
        const empty = `
            <div class="empty-state">
                <i class="bi ${isFiltered ? 'bi-search' : 'bi-inbox'}"></i>
                <h3>${isFiltered ? 'Tidak ketemu' : 'Belum ada produk'}</h3>
                <p>${isFiltered
                    ? 'Coba kata kunci lain, atau bersihkan filter di bawah.'
                    : 'Tambahkan produk pertamamu — langsung tampil di katalog toko.'}</p>
                ${isFiltered
                    ? '<button class="tool-btn" data-action="clear-filter"><i class="bi bi-x-circle"></i> Bersihkan Filter</button>'
                    : '<button class="btn-terra-ad" data-action="add"><i class="bi bi-plus-lg"></i> Tambah Produk Pertama</button>'}
            </div>`;
        if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="padding:0;border:none;">${empty}</td></tr>`;
        if (cards) cards.innerHTML = empty;
        return;
    }

    if (tbody) tbody.innerHTML = items.map(rowHtml).join('');
    if (cards) cards.innerHTML = items.map(cardHtml).join('');
}

function rowHtml(p) {
    const m = stockMeta(p.stok);
    return `
        <tr>
            <td>
                <div class="cell-prod">
                    <img src="${escHtml(p.image_url || PLACEHOLDER)}" alt="${escHtml(p.nama_produk || 'Produk')}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
                    <div><strong>${escHtml(p.nama_produk || '—')}</strong><small>${escHtml(p.deskripsi || '—')}</small></div>
                </div>
            </td>
            <td><span class="badge-cat">${escHtml(p.kategori || '—')}</span></td>
            <td><span class="price">${window.formatRupiah(p.harga)}</span></td>
            <td>
                <span class="stock-pill ${m.cls}">${m.text}</span>
                <span class="stepper" data-row="${escHtml(p.id)}">
                    <button data-admin="minus" title="Kurangi 1" aria-label="Kurangi stok">−</button>
                    <button data-admin="plus" title="Tambah 1" aria-label="Tambah stok">+</button>
                </span>
            </td>
            <td><span class="row-date">${fmtDate(p.created_at)}</span></td>
            <td>
                <div class="row-actions" data-row="${escHtml(p.id)}">
                    <button class="icon-btn edit" data-admin="edit" title="Edit"><i class="bi bi-pencil"></i></button>
                    <button class="icon-btn del" data-admin="del" title="Hapus"><i class="bi bi-trash"></i></button>
                </div>
            </td>
        </tr>`;
}

function cardHtml(p) {
    const m = stockMeta(p.stok);
    return `
        <div class="m-card">
            <div class="m-card-top">
                <img src="${escHtml(p.image_url || PLACEHOLDER)}" alt="${escHtml(p.nama_produk || 'Produk')}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
                <div>
                    <strong>${escHtml(p.nama_produk || '—')}</strong>
                    <span class="badge-cat mt-1">${escHtml(p.kategori || '—')}</span>
                </div>
            </div>
            <div class="m-card-mid">
                <span class="price">${window.formatRupiah(p.harga)}</span>
                <span class="stock-pill ${m.cls}">${m.text}</span>
            </div>
            <div class="d-flex gap-2" data-row="${escHtml(p.id)}">
                <button class="tool-btn flex-fill justify-content-center" data-admin="minus">− Stok</button>
                <button class="tool-btn flex-fill justify-content-center" data-admin="plus">+ Stok</button>
                <button class="icon-btn edit" data-admin="edit" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="icon-btn del" data-admin="del" title="Hapus"><i class="bi bi-trash"></i></button>
            </div>
        </div>`;
}

// ── Alert helper ───────────────────────────────────────────────
function showAlert(msg, type = 'success') {
    document.getElementById('adminToast')?.remove();
    const toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = `alert alert-${type} alert-dismissible position-fixed bottom-0 start-50 translate-middle-x mb-3 shadow z-3`;
    toast.style.cssText = 'min-width:260px;max-width:90vw;border-radius:12px;';
    toast.textContent = msg;
    const x = document.createElement('button');
    x.type = 'button';
    x.className = 'btn-close ms-3';
    x.setAttribute('aria-label', 'Tutup');
    x.addEventListener('click', () => toast.remove());
    toast.appendChild(x);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ── Reset form ─────────────────────────────────────────────────
window.resetForm = function() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').textContent = 'Tambah Produk Baru';
    document.getElementById('productImageFinal').value = '';
    const wrap = document.getElementById('imgPreviewWrap');
    const prev = document.getElementById('imgPreview');
    if (wrap) wrap.style.display = 'none';
    if (prev) prev.src = '';
    state.editingId = null;
};

function openAddModal() {
    window.resetForm();
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

// ── Edit ───────────────────────────────────────────────────────
window.editProduct = function(id) {
    const p = state.products.find(p => String(p.id) === String(id));
    if (!p) return;

    state.editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Produk';
    document.getElementById('productId').value          = p.id;
    document.getElementById('productName').value        = p.nama_produk || '';
    document.getElementById('productCategory').value    = p.kategori    || '';
    document.getElementById('productPrice').value       = p.harga       ?? '';
    document.getElementById('productStock').value       = p.stok        ?? 0;
    document.getElementById('productDescription').value = p.deskripsi   || '';

    const imgUrl = p.image_url || '';
    document.getElementById('productImage').value      = imgUrl.startsWith('data:') ? '' : imgUrl;
    document.getElementById('productImageFinal').value = imgUrl;
    if (imgUrl) {
        const prev = document.getElementById('imgPreview');
        const wrap = document.getElementById('imgPreviewWrap');
        if (prev) prev.src = imgUrl;
        if (wrap) wrap.style.display = 'flex';
    }

    new bootstrap.Modal(document.getElementById('productModal')).show();
};

// ── Stepper stok cepat ─────────────────────────────────────────
async function bumpStock(id, delta) {
    const p = state.products.find(p => String(p.id) === String(id));
    if (!p) return;
    const next = Math.max(0, (Number(p.stok) || 0) + delta);
    try {
        const { error } = await window.supabaseClient
            .from('products').update({ stok: next }).eq('id', id);
        if (error) throw error;
        p.stok = next;
        applyFilters();
    } catch (err) {
        console.error('Error update stok:', err);
        showAlert('Gagal update stok: ' + err.message, 'danger');
    }
}

// ── Hapus ──────────────────────────────────────────────────────
window.deleteProduct = async function(id) {
    const found = state.products.find(p => String(p.id) === String(id));
    const name = found?.nama_produk || 'produk ini';
    const result = await Swal.fire({
        title: 'Hapus produk?',
        html: `<strong>${escHtml(name)}</strong> akan dihapus permanen dari katalog.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DC2626',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
        customClass: { popup: 'rounded-4' }
    });
    if (!result.isConfirmed) return;

    try {
        const { error } = await window.supabaseClient.from('products').delete().eq('id', id);
        if (error) throw error;
        await Swal.fire({ title: 'Terhapus!', text: 'Produk berhasil dihapus.', icon: 'success', customClass: { popup: 'rounded-4' } });
        if (window.showToast) showToast('success', 'Produk berhasil dihapus!');
        await loadProducts();
    } catch (err) {
        console.error('Error deleting product:', err);
        Swal.fire({ title: 'Gagal!', text: 'Gagal menghapus: ' + err.message, icon: 'error', customClass: { popup: 'rounded-4' } });
    }
};

// ── Simpan (tambah/edit) + validasi ────────────────────────────
window.handleFormSubmit = async function(e) {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const kategori = document.getElementById('productCategory').value;
    const harga = parseFloat(document.getElementById('productPrice').value);
    const stok = parseInt(document.getElementById('productStock').value, 10);
    const desc = document.getElementById('productDescription').value.trim();
    const imageFinal = (document.getElementById('productImageFinal')?.value || '').trim()
        || (document.getElementById('productImage')?.value || '').trim();

    if (name.length < 3)        return showAlert('Nama produk minimal 3 huruf.', 'warning');
    if (!kategori)              return showAlert('Pilih kategorinya dulu.', 'warning');
    if (isNaN(harga) || harga <= 0) return showAlert('Harga harus lebih dari Rp 0.', 'warning');
    if (isNaN(stok) || stok < 0)    return showAlert('Stok tidak boleh negatif.', 'warning');
    if (!imageFinal)            return showAlert('Harap pilih gambar atau masukkan URL gambar!', 'warning');
    if (desc.length < 10)       return showAlert('Deskripsi minimal 10 karakter — ceritain motif & bahannya.', 'warning');

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Menyimpan...';

    const productData = { nama_produk: name, kategori, harga, stok, image_url: imageFinal, deskripsi: desc };

    try {
        if (state.editingId) {
            const { error } = await window.supabaseClient
                .from('products').update(productData).eq('id', state.editingId);
            if (error) throw error;
            showAlert('Produk berhasil diperbarui!', 'success');
        } else {
            const { error } = await window.supabaseClient.from('products').insert([productData]);
            if (error) throw error;
            showAlert('Produk baru berhasil ditambahkan!', 'success');
        }
        if (window.showToast) showToast('success', 'Tersimpan!');
        const modalEl = document.getElementById('productModal');
        (bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)).hide();
        await loadProducts();
    } catch (err) {
        console.error('Error saving product:', err);
        showAlert('Gagal menyimpan: ' + err.message, 'danger');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
    }
};

// ── Export CSV ─────────────────────────────────────────────────
function exportCSV() {
    const rows = state.filtered;
    if (!rows.length) return showAlert('Tidak ada data untuk diexport.', 'warning');
    const head = ['nama_produk', 'kategori', 'harga', 'stok', 'deskripsi', 'image_url'];
    const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [head.join(',')]
        .concat(rows.map(p => [p.nama_produk, p.kategori, p.harga, p.stok, p.deskripsi, p.image_url].map(q).join(',')))
        .join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8' }));
    const d = new Date();
    a.download = `kainara-produk-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showAlert(`${rows.length} produk diexport ke CSV.`, 'success');
}

function clearAllFilters() {
    state.query = '';
    state.kategori = '';
    state.sort = 'terbaru';
    state.lowOnly = false;
    state.page = 1;
    const s = document.getElementById('searchInput');
    const k = document.getElementById('filterKategori');
    const o = document.getElementById('sortProduk');
    if (s) s.value = '';
    if (k) k.value = '';
    if (o) o.value = 'terbaru';
    document.getElementById('statMenipis')?.classList.remove('active');
    document.getElementById('statProduk')?.classList.add('active');
    applyFilters();
}

// ── Upload gambar lokal → Base64 ───────────────────────────────
window.convertFileToBase64 = function() {
    const fileInput = document.getElementById('productFileInput');
    const file = fileInput?.files?.[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        showAlert('File maksimal 2MB. Kecilkan dulu atau pakai URL.', 'warning');
        fileInput.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('productImageFinal').value = e.target.result;
        const prev = document.getElementById('imgPreview');
        const wrap = document.getElementById('imgPreviewWrap');
        if (prev) prev.src = e.target.result;
        if (wrap) wrap.style.display = 'flex';
        document.getElementById('productImage').value = '';
    };
    reader.readAsDataURL(file);
};

window.previewFromUrl = function() {
    const url = document.getElementById('productImage').value.trim();
    const prev = document.getElementById('imgPreview');
    const wrap = document.getElementById('imgPreviewWrap');
    document.getElementById('productImageFinal').value = url;
    if (!url) {
        if (wrap) wrap.style.display = 'none';
        return;
    }
    if (prev) prev.src = url;
    if (wrap) wrap.style.display = 'flex';
    const fileInput = document.getElementById('productFileInput');
    if (fileInput) fileInput.value = '';
};

window.clearImageInput = function() {
    document.getElementById('productFileInput').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productImageFinal').value = '';
    const prev = document.getElementById('imgPreview');
    const wrap = document.getElementById('imgPreviewWrap');
    if (prev) prev.src = '';
    if (wrap) wrap.style.display = 'none';
};

// ── Init + wiring ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Sapaan tanggal
    try {
        setText('todayLine', new Date().toLocaleDateString('id-ID',
            { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    } catch {}

    loadProducts();

    // Toolbar
    document.getElementById('searchInput')?.addEventListener('input', e => {
        state.query = e.target.value;
        state.page = 1;
        applyFilters();
    });
    document.getElementById('filterKategori')?.addEventListener('change', e => {
        state.kategori = e.target.value;
        state.page = 1;
        applyFilters();
    });
    document.getElementById('sortProduk')?.addEventListener('change', e => {
        state.sort = e.target.value;
        state.page = 1;
        applyFilters();
    });
    document.getElementById('btnRefresh')?.addEventListener('click', loadProducts);
    document.getElementById('btnExport')?.addEventListener('click', exportCSV);
    document.getElementById('btnPrev')?.addEventListener('click', () => {
        if (state.page > 1) { state.page--; renderTable(); }
    });
    document.getElementById('btnNext')?.addEventListener('click', () => {
        const max = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
        if (state.page < max) { state.page++; renderTable(); }
    });

    // Statistik klik-untuk-filter
    const statGo = (el, fn) => {
        if (!el) return;
        el.addEventListener('click', fn);
        el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
    };
    statGo(document.getElementById('statProduk'), () => {
        state.lowOnly = false;
        document.getElementById('statProduk')?.classList.add('active');
        state.page = 1;
        applyFilters();
        document.getElementById('panel-produk')?.scrollIntoView({ behavior: 'smooth' });
    });
    statGo(document.getElementById('statStok'), () => {
        document.getElementById('panel-produk')?.scrollIntoView({ behavior: 'smooth' });
    });
    statGo(document.getElementById('statNilai'), () => {
        document.getElementById('panel-produk')?.scrollIntoView({ behavior: 'smooth' });
    });
    const lowFilter = () => {
        state.lowOnly = true;
        state.page = 1;
        applyFilters();
        document.getElementById('panel-produk')?.scrollIntoView({ behavior: 'smooth' });
    };
    statGo(document.getElementById('statMenipis'), lowFilter);
    document.getElementById('btnLowShow')?.addEventListener('click', lowFilter);
    document.getElementById('chipLowX')?.addEventListener('click', () => {
        state.lowOnly = false;
        state.page = 1;
        applyFilters();
    });

    // Modal + gambar
    document.getElementById('btnTambahTop')?.addEventListener('click', openAddModal);
    document.getElementById('productForm')?.addEventListener('submit', window.handleFormSubmit);
    document.getElementById('productFileInput')?.addEventListener('change', window.convertFileToBase64);
    document.getElementById('productImage')?.addEventListener('input', window.previewFromUrl);
    document.getElementById('btnClearImg')?.addEventListener('click', window.clearImageInput);

    // Delegasi global: aksi baris + tombol tambah/bersihkan di empty-state
    document.addEventListener('click', e => {
        const act = e.target.closest('[data-action]');
        if (act) {
            if (act.dataset.action === 'add') openAddModal();
            else if (act.dataset.action === 'clear-filter') clearAllFilters();
            return;
        }
        const btn = e.target.closest('[data-admin]');
        if (!btn) return;
        const row = e.target.closest('[data-row]');
        const id = row?.dataset.row;
        if (!id) return;
        if (btn.dataset.admin === 'edit') window.editProduct(id);
        else if (btn.dataset.admin === 'del') window.deleteProduct(id);
        else if (btn.dataset.admin === 'plus') bumpStock(id, 1);
        else if (btn.dataset.admin === 'minus') bumpStock(id, -1);
    });
});
