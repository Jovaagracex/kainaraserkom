import { supabase } from './supabaseClient.js';

const state = {
    products: [],
    filtered: [],
    editingId: null
};

// Formatting Helper
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

const PLACEHOLDER = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80&h=80&fit=crop';

// Load Products
async function loadProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        state.products = data || [];
        filterProducts();
    } catch (err) {
        console.error('Error loading products:', err);
        alert('Gagal memuat data produk: ' + err.message);
    }
}

// Render Table
function renderTable() {
    const tbody = document.getElementById('productTableBody');
    const count = document.getElementById('totalProducts');
    
    if (count) count.textContent = state.filtered.length;
    
    if (state.filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">Belum ada produk.</td></tr>`;
        return;
    }

    tbody.innerHTML = state.filtered.map(p => {
        const stockBadge = p.stok > 10 ? 'bg-success' : p.stok > 0 ? 'bg-warning text-dark' : 'bg-danger';
        const stockText = p.stok > 0 ? `${p.stok} Tersedia` : 'Habis';
        
        return `
            <tr>
                <td data-label="Gambar"><img src="${escHtml(p.image_url || PLACEHOLDER)}" class="rounded object-fit-cover" width="60" height="60" alt="${escHtml(p.nama_produk)}" onerror="this.src='${PLACEHOLDER}'"></td>
                <td data-label="Nama Produk">
                    <div class="fw-semibold text-dark">${escHtml(p.nama_produk)}</div>
                    <div class="text-muted fs-7 text-truncate" style="max-width: 200px;">${escHtml(p.deskripsi || '—')}</div>
                </td>
                <td data-label="Kategori"><span class="badge bg-light border text-dark">${escHtml(p.kategori || '—')}</span></td>
                <td data-label="Harga"><span class="fw-bold" style="color: #D97706;">${formatRupiah(p.harga)}</span></td>
                <td data-label="Stok"><span class="badge ${stockBadge}">${stockText}</span></td>
                <td data-label="Aksi" class="text-end">
                    <button class="btn btn-sm btn-outline-secondary rounded-pill me-1" onclick="editProduct('${p.id}')" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteProduct('${p.id}', '${escHtml(p.nama_produk)}')" title="Hapus">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

}

// Global functions for inline HTML event handlers
window.filterProducts = function() {
    const query = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
    if (!query) {
        state.filtered = [...state.products];
    } else {
        state.filtered = state.products.filter(p => 
            p.nama_produk?.toLowerCase().includes(query) ||
            p.kategori?.toLowerCase().includes(query) ||
            p.deskripsi?.toLowerCase().includes(query)
        );
    }
    renderTable();
};

window.resetForm = function() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').textContent = 'Tambah Produk Baru';
    state.editingId = null;
};

window.editProduct = function(id) {
    const product = state.products.find(p => p.id === id);
    if (!product) return;

    state.editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Produk';
    
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.nama_produk || '';
    document.getElementById('productCategory').value = product.kategori || '';
    document.getElementById('productPrice').value = product.harga || '';
    document.getElementById('productStock').value = product.stok ?? 0;
    document.getElementById('productImage').value = product.image_url || '';
    document.getElementById('productDescription').value = product.deskripsi || '';

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
};

window.deleteProduct = async function(id, name) {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

    try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        
        await loadProducts();
    } catch (err) {
        console.error('Error deleting product:', err);
        alert('Gagal menghapus produk: ' + err.message);
    }
};

window.handleFormSubmit = async function(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Menyimpan...';

    const productData = {
        nama_produk: document.getElementById('productName').value.trim(),
        kategori: document.getElementById('productCategory').value,
        harga: parseFloat(document.getElementById('productPrice').value),
        stok: parseInt(document.getElementById('productStock').value, 10),
        image_url: document.getElementById('productImage').value.trim(),
        deskripsi: document.getElementById('productDescription').value.trim() || null,
    };

    try {
        if (state.editingId) {
            const { error } = await supabase.from('products').update(productData).eq('id', state.editingId);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('products').insert([productData]);
            if (error) throw error;
        }

        // Close modal
        const modalEl = document.getElementById('productModal');
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
        
        // Refresh data
        await loadProducts();
    } catch (err) {
        console.error('Error saving product:', err);
        alert('Gagal menyimpan produk: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', loadProducts);