/**
 * ============================================================
 * Catalog — Kainara Studio
 * Menampilkan produk batik dari Supabase secara real-time
 * Menggunakan window.supabaseClient (dimuat dari supabaseClient.js)
 * ============================================================
 */

const PLACEHOLDER = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop';

function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── State ────────────────────────────────────────────────────
const state = {
    all:      [],
    filtered: [],
    search:   '',
    category: '',
    loading:  false,
};

// ── DOM Refs ─────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = {
    grid:        $('productGrid'),
    loading:     $('loadingState'),
    error:       $('errorState'),
    errorMsg:    $('errorMessage'),
    empty:       $('emptyState'),
    search:      $('searchInput'),
    catFilter:   $('categoryFilter'),
    filterCount: $('filterCount'),
};

// ── Catalog Object ────────────────────────────────────────────
const catalog = {
    async init() {
        this.bindEvents();
        await this.loadProducts();
    },

    bindEvents() {
        el.search?.addEventListener('input', debounce(e => {
            state.search = e.target.value.trim().toLowerCase();
            this.applyFilters();
            this.render();
        }, 280));

        el.catFilter?.addEventListener('change', e => {
            state.category = e.target.value;
            this.applyFilters();
            this.render();
        });
    },

    async loadProducts() {
        if (state.loading) return;
        state.loading = true;
        this.showState('loading');

        try {
            const { data, error } = await window.supabaseClient
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            state.all = data || [];
            this.applyFilters();
            this.render();
        } catch (err) {
            console.error('Catalog load error:', err);
            if (el.errorMsg) el.errorMsg.textContent = err.message;
            this.showState('error');
        } finally {
            state.loading = false;
        }
    },

    applyFilters() {
        let result = [...state.all];
        if (state.search) {
            result = result.filter(p =>
                p.nama_produk?.toLowerCase().includes(state.search) ||
                p.deskripsi?.toLowerCase().includes(state.search) ||
                p.kategori?.toLowerCase().includes(state.search)
            );
        }
        if (state.category) {
            result = result.filter(p => p.kategori === state.category);
        }
        state.filtered = result;
    },

    resetFilters() {
        state.search = ''; state.category = '';
        if (el.search)    el.search.value = '';
        if (el.catFilter) el.catFilter.value = '';
        this.applyFilters();
        this.render();
    },

    render() {
        const products = state.filtered;

        // Update jumlah produk
        if (el.filterCount) {
            const total   = state.all.length;
            const showing = products.length;
            el.filterCount.textContent = (!state.search && !state.category)
                ? `${total} produk`
                : `${showing} dari ${total} produk`;
        }

        if (state.all.length === 0) { this.showState('empty'); return; }
        if (products.length === 0)  { this.showState('empty'); return; }

        this.showState('grid');
        el.grid.innerHTML = products.map(p => this.cardHtml(p)).join('');
    },

    cardHtml(p) {
        const img        = p.image_url || PLACEHOLDER;
        const stockClass = p.stok > 10 ? 'in-stock'  : p.stok > 0 ? 'low-stock' : 'out-stock';
        const stockText  = p.stok > 10 ? 'Tersedia'  : p.stok > 0 ? `Sisa ${p.stok}` : 'Habis';
        const stockIcon  = p.stok > 10 ? 'bi-check-circle' : p.stok > 0 ? 'bi-exclamation-circle' : 'bi-x-circle';

        return `
            <div class="col">
                <article class="product-card h-100">
                    <!-- Gambar produk -->
                    <div class="product-img-wrap">
                        <img src="${escHtml(img)}"
                             alt="${escHtml(p.nama_produk)}"
                             class="product-card-img"
                             loading="lazy"
                             onerror="this.src='${PLACEHOLDER}'">
                        <span class="badge-cat">${escHtml(p.kategori || 'Batik')}</span>
                        <span class="badge-stock ${stockClass}">
                            <i class="bi ${stockIcon}"></i> ${stockText}
                        </span>
                    </div>
                    <!-- Body Card -->
                    <div class="product-body d-flex flex-column">
                        <h3 class="product-name">${escHtml(p.nama_produk)}</h3>
                        <p class="product-desc">${escHtml(p.deskripsi || 'Tidak ada deskripsi.')}</p>
                        <!-- Footer: Harga & Tombol — vertikal di HP, horizontal di Desktop -->
                        <div class="product-footer mt-auto d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
                            <span class="product-price">${window.formatRupiah(p.harga)}</span>
                            <button class="btn-detail w-100 w-sm-auto btn-sm justify-content-center">
                                <i class="bi bi-eye"></i> Detail
                            </button>
                        </div>
                    </div>
                </article>
            </div>`;
    },

    showState(which) {
        el.loading.style.display = which === 'loading' ? 'flex' : 'none';
        el.error.style.display   = which === 'error'   ? 'flex' : 'none';
        el.empty.style.display   = which === 'empty'   ? 'flex' : 'none';
        el.grid.style.display    = which === 'grid'    ? ''     : 'none';
    },
};

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => catalog.init());
window.catalog = catalog;