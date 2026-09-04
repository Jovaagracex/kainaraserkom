/**
 * ============================================================
 * Catalog — Kainara Studio (v2: aman XSS + pagination + wishlist
 * + review + related + filter harga + best seller)
 * ============================================================
 */

const PLACEHOLDER = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop';

function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function T(key, vars) {
    try { if (window.I18n) return window.I18n.t(key, vars); } catch (e) {}
    return key;
}

// ── Wishlist (localStorage) ────────────────────────────────────
const WISH_KEY = 'kainara_wishlist';
const Wishlist = {
    getAll() {
        try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }
        catch { return []; }
    },
    has(id) { return this.getAll().some(x => String(x) === String(id)); },
    toggle(id) {
        let list = this.getAll().map(String);
        id = String(id);
        if (list.includes(id)) list = list.filter(x => x !== id);
        else list.push(id);
        localStorage.setItem(WISH_KEY, JSON.stringify(list));
        catalog.render();
        const n = list.length;
        const badge = document.getElementById('wishCount');
        if (badge) badge.textContent = n;
        if (window.showToast) showToast('success', list.includes(id) ? T('ts_favadd') : T('ts_favdel'));
    }
};
window.Wishlist = Wishlist;

// ── Reviews (localStorage) ─────────────────────────────────────
const REV_KEY = 'kainara_reviews';
const Reviews = {
    getAll(pid) {
        try {
            const all = JSON.parse(localStorage.getItem(REV_KEY)) || {};
            return all[String(pid)] || [];
        } catch { return []; }
    },
    add(pid, { name, rating, text }) {
        let all = {};
        try { all = JSON.parse(localStorage.getItem(REV_KEY)) || {}; } catch { all = {}; }
        pid = String(pid);
        if (!all[pid]) all[pid] = [];
        all[pid].unshift({ name, rating, text, date: new Date().toISOString().slice(0, 10) });
        localStorage.setItem(REV_KEY, JSON.stringify(all));
    },
    avg(pid) {
        const list = this.getAll(pid);
        if (!list.length) return 0;
        return list.reduce((s, r) => s + (r.rating || 5), 0) / list.length;
    }
};
window.Reviews = Reviews;

// ── State ────────────────────────────────────────────────────
const state = {
    all:      [],
    filtered: [],
    search:   '',
    category: '',
    sort:     '',
    priceMin: 0,
    priceMax: 0,
    wishOnly: false,
    bestOnly: false,
    page:     1,
    perPage:  8,
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

// ── Helpers ──────────────────────────────────────────────────
function isBestSeller(p) {
    // Heuristik: stok menipis tapi masih ada = laris
    return (p.stok > 0 && p.stok <= 8);
}
function starsHtml(avg) {
    let out = '';
    for (let i = 1; i <= 5; i++) {
        out += `<i class="bi ${i <= Math.round(avg) ? 'bi-star-fill' : 'bi-star'}"></i>`;
    }
    return out;
}

// ── Catalog Object ────────────────────────────────────────────
const catalog = {
    async init() {
        this.bindEvents();
        this.bindGridDelegation();
        this.bindReviewForm();
        await this.loadProducts();
    },

    getById(id) {
        return state.all.find(p => String(p.id) === String(id)) || null;
    },

    bindEvents() {
        const resetPage = () => { state.page = 1; };
        el.search?.addEventListener('input', debounce(e => {
            state.search = e.target.value.trim().toLowerCase();
            resetPage();
            this.applyFilters();
            this.render();
        }, 280));

        el.catFilter?.addEventListener('change', e => {
            state.category = e.target.value;
            resetPage();
            this.applyFilters();
            this.render();
        });

        $('sortFilter')?.addEventListener('change', e => {
            state.sort = e.target.value;
            resetPage();
            this.applyFilters();
            this.render();
        });
        $('priceMin')?.addEventListener('input', debounce(e => {
            state.priceMin = parseFloat(e.target.value) || 0;
            resetPage();
            this.applyFilters();
            this.render();
        }, 300));
        $('priceMax')?.addEventListener('input', debounce(e => {
            state.priceMax = parseFloat(e.target.value) || 0;
            resetPage();
            this.applyFilters();
            this.render();
        }, 300));
        $('wishToggle')?.addEventListener('click', () => {
            state.wishOnly = !state.wishOnly;
            state.page = 1;
            $('wishToggle').classList.toggle('active', state.wishOnly);
            this.applyFilters();
            this.render();
        });
        $('bestToggle')?.addEventListener('click', () => {
            state.bestOnly = !state.bestOnly;
            state.page = 1;
            $('bestToggle').classList.toggle('active', state.bestOnly);
            this.applyFilters();
            this.render();
        });
        $('paginationWrap')?.addEventListener('click', e => {
            const btn = e.target.closest('[data-page]');
            if (!btn) return;
            const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.perPage));
            let p = parseInt(btn.dataset.page, 10);
            if (isNaN(p)) return;
            state.page = Math.min(Math.max(1, p), totalPages);
            this.render();
            document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    },

    // Delegasi klik kartu: aman dari XSS (tanpa inline onclick ber-data produk)
    bindGridDelegation() {
        el.grid?.addEventListener('click', e => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const id = btn.dataset.id;
            const action = btn.dataset.action;
            if (action === 'detail') openProductDetail(id);
            else if (action === 'cart') {
                const p = this.getById(id);
                if (p && window.Cart) Cart.addItem(p, 1);
            }
            else if (action === 'wish') Wishlist.toggle(id);
        });
    },

    bindReviewForm() {
        const form = $('reviewForm');
        form?.addEventListener('submit', e => {
            e.preventDefault();
            const pid = form.dataset.pid;
            if (!pid) return;
            const name = $('reviewName')?.value.trim();
            const rating = parseInt($('reviewRating')?.value, 10) || 5;
            const text = $('reviewText')?.value.trim();
            if (!name || !text) {
                if (window.showToast) showToast('warning', T('ts_revfill'));
                return;
            }
            Reviews.add(pid, { name, rating, text });
            form.reset();
            openProductDetail(pid); // re-render modal (rating + list)
            if (window.showToast) showToast('success', T('ts_revthanks'));
        });
    },

    async loadProducts() {
        if (state.loading) return;
        state.loading = true;
        this.showState('loading');
        this.renderSkeleton();

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

    renderSkeleton() {
        if (!el.grid) return;
        el.grid.innerHTML = Array.from({ length: 8 }).map(() => `
            <div class="col"><div class="skeleton-card">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-line"></div>
                <div class="skeleton skeleton-line short"></div>
            </div></div>`).join('');
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
        if (state.category) result = result.filter(p => p.kategori === state.category);
        if (state.priceMin > 0) result = result.filter(p => (p.harga || 0) >= state.priceMin);
        if (state.priceMax > 0) result = result.filter(p => (p.harga || 0) <= state.priceMax);
        if (state.wishOnly) result = result.filter(p => Wishlist.has(p.id));
        if (state.bestOnly) result = result.filter(p => isBestSeller(p));
        if (state.sort === 'harga-asc')  result.sort((a, b) => a.harga - b.harga);
        if (state.sort === 'harga-desc') result.sort((a, b) => b.harga - a.harga);
        if (state.sort === 'nama-asc')   result.sort((a, b) => (a.nama_produk || '').localeCompare(b.nama_produk || ''));
        if (state.sort === 'nama-desc')  result.sort((a, b) => (b.nama_produk || '').localeCompare(a.nama_produk || ''));
        state.filtered = result;
    },

    resetFilters() {
        state.search = ''; state.category = ''; state.sort = '';
        state.priceMin = 0; state.priceMax = 0;
        state.wishOnly = false; state.bestOnly = false; state.page = 1;
        if (el.search)    el.search.value = '';
        if (el.catFilter) el.catFilter.value = '';
        const s = $('sortFilter'); if (s) s.value = '';
        const pm = $('priceMin'); if (pm) pm.value = '';
        const px = $('priceMax'); if (px) px.value = '';
        $('wishToggle')?.classList.remove('active');
        $('bestToggle')?.classList.remove('active');
        this.applyFilters();
        this.render();
    },

    render() {
        const products = state.filtered;
        const totalPages = Math.max(1, Math.ceil(products.length / state.perPage));
        if (state.page > totalPages) state.page = totalPages;
        const start = (state.page - 1) * state.perPage;
        const pageItems = products.slice(start, start + state.perPage);

        if (el.filterCount) {
            const total = state.all.length;
            el.filterCount.textContent = (!state.search && !state.category && !state.priceMin && !state.priceMax && !state.wishOnly && !state.bestOnly)
                ? T('count_all', { total: total })
                : T('count_some', { shown: products.length, total: total });
        }

        if (state.all.length === 0 || products.length === 0) {
            this.showState('empty');
            this.renderPagination(0, 1);
            return;
        }

        this.showState('grid');
        el.grid.innerHTML = pageItems.map(p => this.cardHtml(p)).join('');
        this.renderPagination(products.length, totalPages);
    },

    renderPagination(total, totalPages) {
        const wrap = $('paginationWrap');
        if (!wrap) return;
        if (totalPages <= 1) { wrap.innerHTML = ''; return; }
        let btns = '';
        for (let i = 1; i <= totalPages; i++) {
            if (totalPages > 7 && Math.abs(i - state.page) > 2 && i !== 1 && i !== totalPages) {
                if (!btns.endsWith('…')) btns += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
                continue;
            }
            btns += `<li class="page-item ${i === state.page ? 'active' : ''}"><button class="page-link" data-page="${i}">${i}</button></li>`;
        }
        wrap.innerHTML = `
            <nav aria-label="${T('pag_aria')}"><ul class="pagination justify-content-center mt-4">
                <li class="page-item ${state.page === 1 ? 'disabled' : ''}"><button class="page-link" data-page="${state.page - 1}">‹</button></li>
                ${btns}
                <li class="page-item ${state.page === totalPages ? 'disabled' : ''}"><button class="page-link" data-page="${state.page + 1}">›</button></li>
            </ul></nav>`;
    },

    cardHtml(p) {
        const img        = p.image_url || PLACEHOLDER;
        const stockClass = p.stok > 10 ? 'in-stock'  : p.stok > 0 ? 'low-stock' : 'out-stock';
        const stockText  = p.stok > 10 ? T('card_avail')  : p.stok > 0 ? T('card_left', { n: p.stok }) : T('card_out');
        const stockIcon  = p.stok > 10 ? 'bi-check-circle' : p.stok > 0 ? 'bi-exclamation-circle' : 'bi-x-circle';
        const wished = Wishlist.has(p.id);
        const avg = Reviews.avg(p.id);
        const best = isBestSeller(p);

        return `
            <div class="col">
                <article class="product-card h-100">
                    <div class="product-img-wrap">
                        <img src="${escHtml(img)}"
                             alt="${escHtml(p.nama_produk)}"
                             class="product-card-img"
                             loading="lazy"
                             onerror="this.src='${PLACEHOLDER}'">
                        <span class="badge-cat">${escHtml(p.kategori || T('card_defcat'))}</span>
                        ${best ? '<span class="badge-best"><i class="bi bi-fire"></i> ' + T('card_best') + '</span>' : ''}
                        <button class="btn-wish ${wished ? 'active' : ''}" data-action="wish" data-id="${escHtml(p.id)}" aria-label="${T('card_wish_aria')}">
                            <i class="bi ${wished ? 'bi-heart-fill' : 'bi-heart'}"></i>
                        </button>
                        <span class="badge-stock ${stockClass}">
                            <i class="bi ${stockIcon}"></i> ${stockText}
                        </span>
                    </div>
                    <div class="product-body d-flex flex-column">
                        <div class="product-rating">${starsHtml(avg)} <span class="rating-num">${avg ? avg.toFixed(1) : T('card_new')}</span></div>
                        <h3 class="product-name">${escHtml(p.nama_produk)}</h3>
                        <p class="product-desc">${escHtml(p.deskripsi || T('card_nodesc'))}</p>
                        <div class="product-footer mt-auto d-flex flex-column gap-2">
                            <span class="product-price">${window.formatRupiah(p.harga)}</span>
                            <div class="d-flex gap-2">
                                <button class="btn-detail flex-fill btn-sm justify-content-center" data-action="detail" data-id="${escHtml(p.id)}">
                                    <i class="bi bi-eye"></i> ${T('card_detail')}
                                </button>
                                <button class="btn-add-cart btn-sm px-3 justify-content-center" data-action="cart" data-id="${escHtml(p.id)}" aria-label="${T('card_add_aria')}" ${p.stok <= 0 ? 'disabled style="opacity:.5"' : ''}>
                                    <i class="bi bi-bag-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>`;
    },

    showState(which) {
        if (!el.grid) return;
        el.loading.style.display = which === 'loading' ? 'flex' : 'none';
        el.error.style.display   = which === 'error'   ? 'flex' : 'none';
        el.empty.style.display   = which === 'empty'   ? 'flex' : 'none';
        el.grid.style.display    = which === 'grid' || which === 'loading' ? '' : 'none';
        if (which === 'loading' && el.grid) this.renderSkeleton();
    },
};

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => catalog.init());
document.addEventListener('langchange', () => catalog.render());
window.catalog = catalog;

// ── Modal Detail Produk ───────────────────────────────────────
let currentProduct = null;

function openProductDetail(id) {
    const product = catalog.getById(id);
    if (!product) return;

    currentProduct = product;
    const WA_NUMBER = '6281234567890';
    const name  = product.nama_produk || '';
    const price = product.harga || 0;

    const setText = (eid, val) => { const n = document.getElementById(eid); if (n) n.textContent = val; };
    const modalImg = document.getElementById('modalProductImage');
    if (modalImg) {
        modalImg.src = product.image_url || PLACEHOLDER;
        modalImg.alt = name;
    }
    setText('modalProductCategory', product.kategori || T('card_defcat'));
    setText('modalProductTitle', name);
    setText('modalProductPrice', window.formatRupiah(price));
    setText('modalProductDesc', product.deskripsi || T('card_nodesc'));
    setText('modalProductStock', product.stok ?? 0);

    // Rating
    const avg = Reviews.avg(product.id);
    const rWrap = document.getElementById('modalRating');
    if (rWrap) rWrap.innerHTML = `${starsHtml(avg)} <span class="rating-num">${avg ? avg.toFixed(1) + T('rev_count', { n: Reviews.getAll(product.id).length }) : T('no_rev_short')}</span>`;

    // Tombol keranjang di modal (delegasi via data-id, tanpa inline JS ber-data)
    const addBtn = document.getElementById('modalAddCart');
    if (addBtn) {
        addBtn.dataset.id = product.id;
        addBtn.disabled = (product.stok || 0) <= 0;
        addBtn.onclick = () => {
            if (window.Cart) Cart.addItem(product, 1);
            bootstrap.Modal.getInstance(document.getElementById('productDetailModal'))?.hide();
        };
    }

    // WhatsApp
    const modalWA = document.getElementById('modalBuyWA');
    if (modalWA) {
        const msg = encodeURIComponent(`Halo Kainara Studio, saya mau beli ${name} seharga ${window.formatRupiah(price)}`);
        modalWA.href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
        modalWA.onclick = () => { if (window.showToast) showToast('info', T('ts_waopen')); };
    }

    // Share
    const pageUrl = encodeURIComponent(location.href.split('#')[0] + '#katalog');
    const shareText = encodeURIComponent(`${name} — ${window.formatRupiah(price)} di Kainara Studio`);
    const setHref = (eid, href) => { const n = document.getElementById(eid); if (n) n.href = href; };
    setHref('shareWA', `https://wa.me/?text=${shareText}%20${pageUrl}`);
    setHref('shareFB', `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`);
    setHref('shareX', `https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`);
    const copyBtn = document.getElementById('shareCopy');
    if (copyBtn) copyBtn.onclick = async () => {
        try { await navigator.clipboard.writeText(decodeURIComponent(pageUrl)); if (window.showToast) showToast('success', T('ts_copied')); }
        catch { if (window.showToast) showToast('warning', T('ts_copyfail')); }
    };

    // Related (kategori sama, kecualikan diri sendiri, maks 4)
    const relWrap = document.getElementById('relatedGrid');
    if (relWrap) {
        const rel = state.all.filter(p => String(p.id) !== String(product.id) && (p.kategori || '') === (product.kategori || '')).slice(0, 4);
        const list = rel.length ? rel : state.all.filter(p => String(p.id) !== String(product.id)).slice(0, 4);
        relWrap.innerHTML = list.map(p => `
            <button class="related-item" data-rel="${escHtml(p.id)}">
                <img src="${escHtml(p.image_url || PLACEHOLDER)}" alt="${escHtml(p.nama_produk)}" loading="lazy" onerror="this.src='${PLACEHOLDER}'">
                <span class="related-name">${escHtml(p.nama_produk)}</span>
                <span class="related-price">${window.formatRupiah(p.harga)}</span>
            </button>`).join('') || `<p class="text-muted small">${T('no_rel')}</p>`;
        relWrap.querySelectorAll('[data-rel]').forEach(b => {
            b.onclick = () => openProductDetail(b.dataset.rel);
        });
    }

    // Reviews list
    const revWrap = document.getElementById('reviewList');
    if (revWrap) {
        const list = Reviews.getAll(product.id);
        revWrap.innerHTML = list.length ? list.map(r => `
            <div class="review-item">
                <div class="d-flex justify-content-between align-items-center">
                    <strong>${escHtml(r.name)}</strong>
                    <span class="testimoni-stars">${starsHtml(r.rating)}</span>
                </div>
                <p>${escHtml(r.text)}</p>
                <small class="text-muted">${escHtml(r.date || '')}</small>
            </div>`).join('') : `<p class="text-muted small">${T('no_rev')}</p>`;
    }
    const form = document.getElementById('reviewForm');
    if (form) form.dataset.pid = product.id;

    new bootstrap.Modal(document.getElementById('productDetailModal')).show();
}
window.openProductDetail = openProductDetail;

// ── Checkout Cepat (legacy; checkout penuh via cart) ──────────
function processCheckout() {
    if (!currentProduct) return;
    if (window.Cart) { Cart.addItem(currentProduct, 1); Cart.checkout(); return; }
    const name  = currentProduct.nama_produk || 'Produk';
    bootstrap.Modal.getInstance(document.getElementById('productDetailModal'))?.hide();
    setTimeout(() => {
        if (window.showToast) showToast('success', T('ts_made', { name: name }));
        else alert(`Pesanan "${name}" sedang diproses ke Sistem Checkout.`);
    }, 300);
}
window.processCheckout = processCheckout;
