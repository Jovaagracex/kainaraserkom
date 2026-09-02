/**
 * Supabase Client Configuration
 * 
 * IMPORTANT: Replace the placeholder values below with your actual Supabase credentials.
 * For production deployment (Vercel/Netlify), use Environment Variables instead.
 * 
 * Get your credentials from: https://supabase.com/dashboard/project/_/settings/api
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ============================================
// CONFIGURATION - REPLACE WITH YOUR VALUES
// ============================================
const SUPABASE_URL = 'https://pomcmyqywwdqcmzupjgh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__GVwYU1pnuqF_c-F1EU0kQ_549W5tSH';
// ============================================

// Validate configuration
if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn(
        '%c⚠️ Supabase Configuration Required',
        'color: #C85C3E; font-size: 14px; font-weight: bold;'
    );
    console.warn('Please update SUPABASE_URL and SUPABASE_ANON_KEY in js/supabaseClient.js');
    console.warn('Get credentials from: https://supabase.com/dashboard/project/_/settings/api');
}

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false, // No auth needed for this demo
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

// Export configuration for debugging
export const supabaseConfig = {
    url: SUPABASE_URL,
    hasValidConfig: SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY',
};

// Helper function to check connection
export async function testConnection() {
    if (!supabaseConfig.hasValidConfig) {
        return { success: false, error: 'Configuration not set' };
    }
    
    try {
        const { data, error } = await supabase.from('products').select('id').limit(1);
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Default placeholder image
export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300/FFF8F3/C85C3E?text=Kainara+Studio';

// Category configuration
export const CATEGORIES = [
    { value: 'Batik Tulis', label: 'Batik Tulis', badgeClass: 'batik-tulis', icon: 'bi-pen' },
    { value: 'Batik Cap', label: 'Batik Cap', badgeClass: 'batik-cap', icon: 'bi-stamp' },
    { value: 'Batik Printing', label: 'Batik Printing', badgeClass: 'batik-printing', icon: 'bi-printer' },
    { value: 'Lainnya', label: 'Lainnya', badgeClass: 'lainnya', icon: 'bi-tag' },
];

export function getCategoryConfig(category) {
    return CATEGORIES.find(c => c.value === category) || CATEGORIES[3];
}

// Format currency (IDR)
export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Format date (Indonesian locale)
export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

// Debounce function for search
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Generate UUID (client-side fallback)
export function generateId() {
    return crypto.randomUUID();
}