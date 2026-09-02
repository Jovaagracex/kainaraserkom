/**
 * Featured Products — Landing Page
 * Menampilkan 4 produk unggulan dari Supabase
 */

const FEATURED_PLACEHOLDER = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=500&fit=crop';

const featured = {
    async init() {
        await this.loadFeatured();
    },

    async loadFeatured() {
        const grid = document.getElementById('featuredGrid');
        if (!grid) return;

        try {
            const { data, error } = await window.supabaseClient
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) throw error;

            grid.innerHTML = (data || []).map(p => this.cardHtml(p)).join('');
        } catch (err) {
            console.error('Featured load error:', err);
            grid.innerHTML = '<p class="text-center text-muted col-12">Gagal memuat produk unggulan.</p>';
        }
    },

    cardHtml(p) {
        const img = p.image_url || FEATURED_PLACEHOLDER;
        const stockClass = p.stok > 10 ? 'in-stock' : p.stok > 0 ? 'low-stock' : 'out-stock';
        const stockText = p.stok > 10 ? 'Tersedia' : p.stok > 0 ? `Sisa ${p.stok}` : 'Habis';
        const stockIcon = p.stok > 10 ? 'bi-check-circle' : p.stok > 0 ? 'bi-exclamation-circle' : 'bi-x-circle';

        return `
            <div class="col">
                <article class="product-card h-100">
                    <div class="product-img-wrap">
                        <img src="${escHtml(img)}"
                             alt="${escHtml(p.nama_produk)}"
                             class="product-card-img"
                             loading="lazy"
                             onerror="this.src='${FEATURED_PLACEHOLDER}'">
                        <span class="badge-cat">${escHtml(p.kategori || 'Batik')}</span>
                        <span class="badge-stock ${stockClass}">
                            <i class="bi ${stockIcon}"></i> ${stockText}
                        </span>
                    </div>
                    <div class="product-body d-flex flex-column">
                        <h3 class="product-name">${escHtml(p.nama_produk)}</h3>
                        <p class="product-desc">${escHtml(p.deskripsi || 'Tidak ada deskripsi.')}</p>
                        <div class="product-footer mt-auto d-flex flex-column gap-2">
                            <span class="product-price">${window.formatRupiah(p.harga)}</span>
                            <button class="btn-detail w-100 btn-sm justify-content-center">
                                <i class="bi bi-eye"></i> Detail
                            </button>
                        </div>
                    </div>
                </article>
            </div>`;
    },
};

document.addEventListener('DOMContentLoaded', () => featured.init());
