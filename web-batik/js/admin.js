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

function T(key, vars) {
    try { if (window.I18n) return window.I18n.t(key, vars); } catch (e) {}
    return key;
}
function dateLocale() {
    try {
        const l = window.I18n ? window.I18n.get() : 'id';
        return { id: 'id-ID', en: 'en-US', ja: 'ja-JP', ar: 'ar-EG' }[l] || 'id-ID';
    } catch (e) { return 'id-ID'; }
}
function paintDate() {
    try {
        setText('todayLine', new Date().toLocaleDateString(dateLocale(),
            { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    } catch {}
}

// ── Helper tanggal id ──────────────────────────────────────────
function fmtDate(iso) {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString(dateLocale(), { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return '—'; }
}

function stockMeta(stok) {
    const s = Number(stok) || 0;
    if (s <= 0)  return { cls: 'out',  text: T('a_out') };
    if (s <= LOW_STOCK) return { cls: 'warn', text: T('a_low', { n: s }) };
    return { cls: 'ok', text: T('a_ok', { n: s }) };
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
        showAlert(T('a_loadfail') + err.message, 'danger');
        state.products = [];
        applyFilters();
    }
}

function renderSkeleton() {
    const grid = document.getElementById('productGrid');
    if (grid) {
        grid.innerHTML = Array.from({ length: 8 })
            .map(() => '<div class="skel-card"><div class="skel-img"></div><div class="skel-line"></div><div class="skel-line" style="width:60%"></div></div>')
            .join('');
    }
    const info = document.getElementById('pagerInfo');
    if (info) info.textContent = T('a_loading');
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
            setText('lowBannerText', T('a_banner', { n: menipis.length, low: LOW_STOCK }));
        }
    }
    document.getElementById('statMenipis')?.classList.toggle('active', state.lowOnly);
    document.getElementById('chipLow')?.classList.toggle('show', state.lowOnly);
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ── Pil kategori dinamis ───────────────────────────────────────
function renderKategoriOptions() {
    const wrap = document.getElementById('catPills');
    if (!wrap) return;
    const cats = [...new Set(state.products.map(p => (p.kategori || '').trim()).filter(Boolean))].sort();
    const pills = [{ v: '', t: T('a_all', { n: state.products.length }) }]
        .concat(cats.map(c => {
            const n = state.products.filter(p => (p.kategori || '') === c).length;
            return { v: c, t: `${c} (${n})` };
        }));
    wrap.innerHTML = pills.map(p =>
        `<button class="cat-pill${state.kategori === p.v ? ' on' : ''}" data-cat="${escHtml(p.v)}">${escHtml(p.t)}</button>`
    ).join('');
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

// ── Render grid kartu + pager ──────────────────────────────────
function renderTable() {
    const grid = document.getElementById('productGrid');
    const info = document.getElementById('pagerInfo');
    const prev = document.getElementById('btnPrev');
    const next = document.getElementById('btnNext');

    const total = state.filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / state.perPage));
    const start = (state.page - 1) * state.perPage;
    const items = state.filtered.slice(start, start + state.perPage);

    if (info) {
        info.textContent = total === 0
            ? T('a_none')
            : T('a_showing', { a: start + 1, b: start + items.length, total: total });
    }
    if (prev) prev.disabled = state.page <= 1;
    if (next) next.disabled = state.page >= maxPage;
    [prev, next].forEach(b => { if (b) b.style.opacity = b.disabled ? '.45' : '1'; });

    if (!grid) return;
    if (total === 0) {
        const isFiltered = state.query || state.kategori || state.lowOnly;
        grid.innerHTML = `
            <div class="empty-state">
                <i class="bi ${isFiltered ? 'bi-search' : 'bi-inbox'}"></i>
                <h3>${isFiltered ? T('a_empty_t1') : T('a_empty_t2')}</h3>
                <p>${isFiltered
                    ? T('a_tryother')
                    : T('a_empty_d')}</p>
                ${isFiltered
                    ? `<button class="tool-btn" data-action="clear-filter"><i class="bi bi-x-circle"></i> ${T('a_clearfilter')}</button>`
                    : `<button class="btn-terra-ad" data-action="add"><i class="bi bi-plus-lg"></i> ${T('a_addfirst')}</button>`}
            </div>`;
        return;
    }

    grid.innerHTML = items.map(gridCardHtml).join('');
}

function gridCardHtml(p) {
    const m = stockMeta(p.stok);
    return `
        <article class="p-card">
            <div class="p-card-img">
                <img src="${escHtml(p.image_url || PLACEHOLDER)}" alt="${escHtml(p.nama_produk || 'Produk')}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
                <span class="p-flag ${m.cls}">${m.text}</span>
            </div>
            <div class="p-card-body">
                <h3>${escHtml(p.nama_produk || '—')}</h3>
                <div class="p-meta"><span>${escHtml(p.kategori || '—')}</span><span class="sep">${fmtDate(p.created_at)}</span></div>
                <div class="p-price">${window.formatRupiah(p.harga)}</div>
                <div class="p-stockline" data-row="${escHtml(p.id)}">
                    <span class="p-stocktxt">${T('a_stock', { n: Number(p.stok) || 0 })}</span>
                    <span class="stepper">
                        <button data-admin="minus" title="${T('a_stockdec')}" aria-label="${T('a_stockdec')}">−</button>
                        <button data-admin="plus" title="${T('a_add1')}" aria-label="${T('a_add1')}">+</button>
                    </span>
                </div>
                <div class="p-actions" data-row="${escHtml(p.id)}">
                    <button class="p-edit" data-admin="edit"><i class="bi bi-pencil"></i> ${T('a_edit')}</button>
                    <button class="p-del" data-admin="del"><i class="bi bi-trash"></i> ${T('a_del')}</button>
                </div>
            </div>
        </article>`;
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
    x.setAttribute('aria-label', T('a_close'));
    x.addEventListener('click', () => toast.remove());
    toast.appendChild(x);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ── Reset form ─────────────────────────────────────────────────
window.resetForm = function() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').textContent = T('modal_add');
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
    document.getElementById('modalTitle').textContent = T('modal_edit');
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
        showAlert(T('a_stockfail') + err.message, 'danger');
    }
}

// ── Hapus ──────────────────────────────────────────────────────
window.deleteProduct = async function(id) {
    const found = state.products.find(p => String(p.id) === String(id));
    const name = found?.nama_produk || 'produk ini';
    const result = await Swal.fire({
        title: T('a_del_t'),
        html: T('a_del_h', { name: escHtml(name) }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DC2626',
        cancelButtonColor: '#6B7280',
        confirmButtonText: T('a_confirm_yes'),
        cancelButtonText: T('f_cancel'),
        customClass: { popup: 'rounded-4' }
    });
    if (!result.isConfirmed) return;

    try {
        const { error } = await window.supabaseClient.from('products').delete().eq('id', id);
        if (error) throw error;
        await Swal.fire({ title: T('a_del_ok_t'), text: T('a_del_ok_x'), icon: 'success', customClass: { popup: 'rounded-4' } });
        if (window.showToast) showToast('success', T('a_deleted'));
        await loadProducts();
    } catch (err) {
        console.error('Error deleting product:', err);
        Swal.fire({ title: T('a_fail'), text: T('a_delfail') + err.message, icon: 'error', customClass: { popup: 'rounded-4' } });
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

    if (name.length < 3)        return showAlert(T('a_name3'), 'warning');
    if (!kategori)              return showAlert(T('a_cat'), 'warning');
    if (isNaN(harga) || harga <= 0) return showAlert(T('a_price0'), 'warning');
    if (isNaN(stok) || stok < 0)    return showAlert(T('a_stockneg'), 'warning');
    if (!imageFinal)            return showAlert(T('a_img'), 'warning');
    if (desc.length < 10)       return showAlert(T('a_desc10'), 'warning');

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>' + T('f_saving');

    const productData = { nama_produk: name, kategori, harga, stok, image_url: imageFinal, deskripsi: desc };

    try {
        if (state.editingId) {
            const { error } = await window.supabaseClient
                .from('products').update(productData).eq('id', state.editingId);
            if (error) throw error;
            showAlert(T('a_updated'), 'success');
        } else {
            const { error } = await window.supabaseClient.from('products').insert([productData]);
            if (error) throw error;
            showAlert(T('a_added'), 'success');
        }
        if (window.showToast) showToast('success', T('a_saved'));
        const modalEl = document.getElementById('productModal');
        (bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)).hide();
        await loadProducts();
    } catch (err) {
        console.error('Error saving product:', err);
        showAlert(T('a_savefail') + err.message, 'danger');
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
    const o = document.getElementById('sortProduk');
    if (s) s.value = '';
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
    // Sapaan tanggal (mengikuti bahasa aktif)
    paintDate();

    loadProducts();

    // Toolbar
    document.getElementById('searchInput')?.addEventListener('input', e => {
        state.query = e.target.value;
        state.page = 1;
        applyFilters();
    });
    document.getElementById('catPills')?.addEventListener('click', e => {
        const pill = e.target.closest('[data-cat]');
        if (!pill) return;
        state.kategori = pill.dataset.cat;
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

    // Transisi animasi sebelum pindah (Toko / Portofolio / Kunci)
    const goLoader = document.getElementById('goLoader');
    const goSub = document.getElementById('goSub');
    const goFill = document.getElementById('goFill');
    const goPct = document.getElementById('goPct');
    const goCalm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function playTransition(label, done) {
        if (goCalm || !goLoader) { done(); return; }
        if (goSub) goSub.textContent = label;
        goLoader.classList.add('show');
        const DUR = 750;
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / DUR, 1);
            const eased = 1 - Math.pow(1 - p, 2);
            if (goFill) goFill.style.width = (eased * 100).toFixed(0) + '%';
            if (goPct) goPct.textContent = (eased * 100).toFixed(0) + '%';
            if (p < 1) requestAnimationFrame(step);
            else done();
        };
        requestAnimationFrame(step);
    }

    document.querySelectorAll('.top-link').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            if (a.id === 'btnLogout') {
                // Kunci lagi: reload saja — PIN selalu ditanya tiap halaman dibuka
                playTransition(T('top_lock') + '…', () => {
                    location.reload();
                });
                return;
            }
            const href = a.getAttribute('href');
            if (!href || href === '#') return;
            const label = a.id === 'btnLogout' ? '' :
                /portofolio/i.test(href) ? T('top_port') + '…' : T('top_shop') + '…';
            playTransition(label, () => { window.location.href = href; });
        });
    });

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

    // Render ulang + tanggal lokal saat bahasa diganti
    document.addEventListener('langchange', () => {
        paintDate();
        renderKategoriOptions();
        renderStats();
        renderTable();
    });
});
