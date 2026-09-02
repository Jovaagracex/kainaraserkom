/**
 * ============================================================
 * Supabase Client — Kainara Studio
 * Kredensial langsung (Publishable/Anon Key — aman di frontend)
 * Keamanan data dijaga oleh Row Level Security (RLS) Supabase
 * ============================================================
 */

const SUPABASE_URL      = 'https://pomcmyqywwdqcmzupjgh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__GVwYU1pnuqF_c-F1EU0kQ_549W5tSH';

// Inisialisasi client menggunakan UMD global yang dimuat dari CDN
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession:   false,
        autoRefreshToken: false,
    },
    db: {
        schema: 'public',
    },
    global: {
        headers: {
            'X-Client-Info': 'kainara-studio@1.0.0',
        },
    },
});

// ── Helper: format Rupiah ─────────────────────────────────────
window.formatRupiah = function(num) {
    if (!num && num !== 0) return 'Rp —';
    return new Intl.NumberFormat('id-ID', {
        style:              'currency',
        currency:           'IDR',
        maximumFractionDigits: 0,
    }).format(num);
};

// ── Helper: escape HTML (mencegah XSS) ───────────────────────
window.escHtml = function(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
};

// ── Helper: test koneksi (opsional, untuk debug) ──────────────
window.testSupabaseConnection = async function() {
    try {
        const { data, error } = await window.supabaseClient
            .from('products').select('id').limit(1);
        if (error) throw error;
        console.info('%c✅ Supabase terhubung!', 'color:#16a34a;font-weight:bold;');
        return { success: true, data };
    } catch (err) {
        console.error('%c❌ Supabase ERROR:', 'color:#dc2626;font-weight:bold;', err.message);
        return { success: false, error: err.message };
    }
};