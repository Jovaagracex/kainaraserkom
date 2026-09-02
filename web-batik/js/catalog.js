/**
 * Catalog Module — Kainara Studio
 * Fetches products from Supabase and renders using new Warm Editorial UI
 */

import { supabase } from './supabaseClient.js';

// ── Helpers ──────────────────────────────────────────────────────────────
const PLACEHOLDER = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop';

function formatRupiah(num) {
    if (!num && num !== 0) return 'Rp —';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}
function escHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}
function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── State ──────────────────────────────────────────────────────────────
const state = {
    all: [],
    filtered: [],
    search: '',
    category: '',
    loading: false,
};

// ── DOM Refs ─────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = {
    grid:       $('productGrid'),
    loading:    $('loadingState'),
    error:      $('errorState'),
    errorMsg:   $('errorMessage'),
    empty:      $('emptyState'),
    search:     $('searchInput'),
    catFilter:  $('categoryFilter'),
    filterCount:$('filterCount'),
};

// ── Catalog Object ────────────────────────────────────────────────────
export const catalog = {
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
            const { data, error } = await supabase
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
        if (el.search) el.search.value = '';
        if (el.catFilter) el.catFilter.value = '';
        this.applyFilters();
        this.render();
    },

    render() {
        const products = state.filtered;

        // Update count
        if (el.filterCount) {
            const total = state.all.length;
            const showing = products.length;
            if (!state.search && !state.category) {
                el.filterCount.textContent = `${total} produk`;
            } else {
                el.filterCount.textContent = `${showing} dari ${total} produk`;
            }
        }

        if (state.all.length === 0) { this.showState('empty'); return; }
        if (products.length === 0)  { this.showState('empty'); return; }

        this.showState('grid');
        el.grid.innerHTML = products.map(p => this.cardHtml(p)).join('');
    },

    cardHtml(p) {
        const img = p.image_url || PLACEHOLDER;
        const stockClass = p.stok > 10 ? 'in-stock' : p.stok > 0 ? 'low-stock' : 'out-stock';
        const stockText  = p.stok > 10 ? 'Tersedia' : p.stok > 0 ? `Sisa ${p.stok}` : 'Habis';
        const stockIcon  = p.stok > 10 ? 'bi-check-circle' : p.stok > 0 ? 'bi-exclamation-circle' : 'bi-x-circle';

        return `
            <div class="col">
                <article class="product-card h-100">
                    <!-- Gambar — tinggi tetap 240px agar semua card seragam -->
                    <div class="product-img-wrap">
                        <img
                            src="${escHtml(img)}"
                            alt="${escHtml(p.nama_produk)}"
                            class="product-card-img"
                            loading="lazy"
                            onerror="this.src='${PLACEHOLDER}'"
                        >
                        <span class="badge-cat">${escHtml(p.kategori || 'Batik')}</span>
                        <span class="badge-stock ${stockClass}">
                            <i class="bi ${stockIcon}"></i> ${stockText}
                        </span>
                    </div>
                    <!-- Body — flex column agar footer selalu di bawah -->
                    <div class="product-body d-flex flex-column">
                        <h3 class="product-name">${escHtml(p.nama_produk)}</h3>
                        <p class="product-desc">${escHtml(p.deskripsi || 'Tidak ada deskripsi.')}</p>
                        <!-- Harga & Tombol — mt-auto memaksa ke bawah card -->
                        <div class="product-footer mt-auto">
                            <span class="product-price">${formatRupiah(p.harga)}</span>
                            <button class="btn-detail">
                                <i class="bi bi-eye"></i> Detail
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        `;
    },

    showState(which) {
        el.loading.style.display = which === 'loading' ? 'flex'  : 'none';
        el.error.style.display   = which === 'error'   ? 'flex'  : 'none';
        el.empty.style.display   = which === 'empty'   ? 'flex'  : 'none';
        // 'row' adalah display value yang benar untuk Bootstrap .row
        el.grid.style.display    = which === 'grid'    ? ''      : 'none';
    },
};

document.addEventListener('DOMContentLoaded', () => catalog.init());
window.catalog = catalog;