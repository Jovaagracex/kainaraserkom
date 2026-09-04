/* ============================================================
 * I18n — Kainara Studio (web-batik)
 * - Kamus: toko (index.html) + admin (admin.html)
 * - Cara pakai di HTML: data-i18n="kunci" (isi/teks),
 *   data-i18n-ph="kunci" (placeholder), data-i18n-aria="kunci"
 *   (aria-label), data-i18n-title="kunci" (title/tooltip).
 * - Di JS dinamis: I18n.t('kunci', {nama: '...'}).
 * - Bahasa tersimpan di localStorage 'site-lang'. Default: id.
 * ============================================================ */
(function () {
    'use strict';

    var LANGS = {
        id: { label: 'Indonesia', short: 'ID', dir: 'ltr', html: 'id' },
        en: { label: 'English',   short: 'EN', dir: 'ltr', html: 'en' },
        ja: { label: '日本語',      short: 'JA', dir: 'ltr', html: 'ja' },
        ar: { label: 'العربية',    short: 'AR', dir: 'rtl', html: 'ar' }
    };

    var DICT = {
        /* ================= TOKO (index.html) ================= */
        store: {
            id: {
                nav_beranda: 'Beranda', nav_katalog: 'Katalog', nav_tentang: 'Tentang', nav_kontak: 'Kontak',
                nav_portofolio: 'Portofolio', nav_admin: 'Admin', cart_aria: 'Keranjang', lang_aria: 'Pilih bahasa',
                off_msg: 'Kamu lagi offline — katalog mungkin nggak update. Cek koneksi dulu ya.',
                loader_back: 'Kembali ke portofolio...',
                hero_eyebrow: 'Koleksi Eksklusif 2026',
                hero_title: 'Batik <em>Premium</em><br>dari Hati Pengrajin',
                hero_sub: 'Saya kerja sama langsung dengan pengrajin di Solo, Pekalongan, dan Lasem. Tiap motif saya pilih sendiri — yang lolos kurasi baru saya jual di sini.',
                hero_shop: 'Belanja Sekarang', hero_story: 'Cerita Kami',
                hero_note: 'stok difoto satu-satu pakai HP saya ->',
                hero_img_alt: 'Koleksi Batik Kainara Studio',
                promo_badge: 'FLASH SALE — TERBATAS!',
                promo_title: 'Diskon Hingga <span class="promo-glow" style="color: #D97706;">50%</span>',
                promo_sub: 'Koleksi batik pilihan dengan harga spesial. Berlaku hingga stok habis — jangan lewatkan!',
                promo_limited: 'Stok terbatas!', promo_cta: 'Klaim Diskon Sekarang',
                promo_img_alt: 'Promo Batik',
                marquee: 'Batik Tulis <span class="o">✦</span> Batik Cap <span class="o">✦</span> Pengrajin Solo <span class="o">✦</span> Pekalongan <span class="o">✦</span> Lasem <span class="o">✦</span> Order via WhatsApp <span class="o">✦</span>&nbsp;',
                cat_eyebrow: 'Katalog Produk', cat_title: 'Koleksi Batik Terpilih',
                cat_sub: 'Setiap kain dibuat dengan penuh ketelitian — dari pilihan bahan hingga ketajaman motif.',
                search_ph: 'Cari nama produk, motif, deskripsi...', search_aria: 'Cari produk',
                all_cat: 'Semua Kategori', sort_l: 'Urutkan',
                sort_lo: 'Harga: Rendah', sort_hi: 'Harga: Tinggi', sort_az: 'Nama: A-Z', sort_za: 'Nama: Z-A',
                min_ph: 'Min Rp', max_ph: 'Max Rp', min_aria: 'Harga minimum', max_aria: 'Harga maksimum',
                fav: '♥ Favorit', fav_aria: 'Hanya favorit', best: '🔥 Terlaris', best_aria: 'Hanya terlaris',
                loading: 'Memuat koleksi batik...',
                err_title: 'Gagal Memuat Produk', retry: 'Coba Lagi',
                empty_title: 'Produk Tidak Ditemukan', empty_sub: 'Coba ubah kata kunci atau pilih kategori lain',
                reset: 'Reset Filter',
                count_all: '{total} produk', count_some: '{shown} dari {total} produk',
                card_avail: 'Tersedia', card_left: 'Sisa {n}', card_out: 'Habis',
                card_detail: 'Detail', card_add_aria: 'Tambah ke keranjang', card_wish_aria: 'Favorit',
                card_best: 'Terlaris', card_new: 'Baru', card_nodesc: 'Tidak ada deskripsi.', card_defcat: 'Batik',
                pag_aria: 'Navigasi halaman produk',
                steps_eyebrow: 'Gampang, nggak ribet', steps_title: 'Cara Pesan',
                steps_sub: 'Nggak ada tombol bayar otomatis — semua lewat chat, biar bisa tanya-tanya dulu.',
                s1t: 'Pilih batiknya', s1d: 'Scroll katalog, klik produk buat lihat detail, stok, dan ulasan pembeli lain.',
                s2t: 'Klik order via WhatsApp', s2d: 'Bisa langsung dari halaman produk, dari keranjang, atau checkout sekalian. Pesan otomatis sudah terisi.',
                s3t: 'Bayar & paket dikirim', s3d: 'Transfer setelah saya konfirmasi stok. Paket dibungkus rapi, dikirim maks 2x24 jam.',
                steps_note: 'Masih bingung? Chat saja dulu — nanya-nanya gratis, nggak wajib beli.',
                about_eyebrow: 'Tentang Kami', about_title: 'Kenapa saya jualan batik',
                quote: '"Awalnya cuma bantu jualin kain sisa tetangga yang pengrajin di Solo. Ternyata banyak yang suka. Ya sudah, saya seriusin."',
                cite: '— Erlangga, pemilik Kainara Studio',
                p1: 'Saya nggak punya toko fisik. Semua saya kerjakan sendiri: foto produk, upload ke katalog, bungkus paket, sampai balas chat. Makanya kalau chat dibalas agak lama, mohon maklum — kemungkinan saya lagi ke kantor pos.',
                r1t: 'Motif saya pilih sendiri.', r1d: 'Nggak semua kain dari pengrajin saya ambil — cuma yang bahannya adem dan jahitannya rapi.',
                r2t: 'Harga wajar, bukan harga turis.', r2d: 'Karena tanpa perantara, selisihnya saya kembalikan ke harga, bukan ke kantong sendiri semua.',
                r3t: 'Salah kirim? Tukar.', r3d: 'Fotoin saja barangnya, saya kirim pengganti. Selama ini baru 2 kali kejadian.',
                xp: 'Tahun<br>Berkarya',
                about_img_alt: 'Proses membatik', about_mini_alt: 'Detail motif batik',
                testi_eyebrow: 'Testimoni', testi_title: 'Apa Kata Mereka?',
                testi_sub: 'Cerita nyata dari pelanggan yang puas dengan batik pilihan kami.',
                t1: '"Batiknya sangat elegan dan premium. Bahannya adem, jahitan rapi. Sudah 3 kali beli disini, selalu puas!"',
                t2: '"Kemeja batik untuk acara kantor. Motifnya unik, tidak pasaran. Pengiriman cepat dan packaging rapi."',
                t3: '"Gaun batiknya cantik banget! Cocok buat kondangan. Adminnya ramah dan fast response. Recommended!"',
                ct_eyebrow: 'Hubungi Kami', ct_title: 'Butuh Bantuan?<br>Kami Siap Melayani',
                wa_l: 'WhatsApp', wa_s: 'Chat Admin', em_l: 'Email', ig_l: 'Instagram', tt_l: 'TikTok',
                form_t: 'Kirim Pesan Cepat', name_ph: 'Nama Anda', phone_ph: 'No. WhatsApp (opsional)',
                msg_ph: 'Tulis pesan...', send: 'Kirim via WhatsApp',
                ft_tag: 'Mewarisi warisan batik Indonesia dengan sentuhan modern. Setiap motif memiliki cerita, setiap kain memiliki jiwa.',
                ft_nav: 'Navigasi', ft_cat: 'Kategori', ft_info: 'Informasi',
                ft_about: 'Tentang Kami', ft_contact: 'Kontak', ft_admin: 'Panel Admin',
                ft_special: 'Koleksi Khusus', ft_how: 'Cara Pemesanan', ft_help: 'Kontak & Bantuan', ft_top: 'Kembali ke Atas',
                ft_copy: '&copy; 2026 Kainara Studio — dibuat sendiri pakai HTML + Supabase, tanpa template toko.',
                ft_dev: 'Portofolio Developer',
                m_how: 'Pilih Cara Pembelian:', m_add: 'Tambah ke Keranjang', m_wa: 'Order via WhatsApp',
                m_stock: 'Stok Tersedia:', m_pcs: 'pcs', m_rel: 'Produk Terkait', m_rev: 'Ulasan Pembeli',
                rev_name_ph: 'Nama', rev_text_ph: 'Tulis ulasan...', rev_send: 'Kirim Ulasan',
                no_rel: 'Belum ada produk terkait.',
                rev_count: ' ({n} ulasan)', no_rev_short: 'Belum ada ulasan', no_rev: 'Belum ada ulasan. Jadilah yang pertama!',
                c_title: 'Keranjang Belanja', c_empty: 'Keranjang kosong', c_total: 'Total',
                c_checkout: 'Checkout', c_clear: 'Kosongkan Keranjang', c_confirm: 'Kosongkan keranjang?',
                c_dec: 'Kurangi', c_inc: 'Tambah', c_del: 'Hapus',
                c_hist: 'Riwayat Pesanan ({n})', c_item: 'item',
                co_title: 'Checkout Pesanan', co_sum: 'Ringkasan Pesanan', co_total: 'Total', co_self: 'Data Diri',
                co_name: 'Nama Lengkap', co_phone: 'No. Telepon / WhatsApp', co_addr: 'Alamat Pengiriman', co_note: 'Catatan (Opsional)',
                co_name_ph: 'Siti Rahayu', co_phone_ph: '0812xxxxxxx', co_addr_ph: 'Jl. Merdeka No. 10, Jakarta Selatan',
                co_note_ph: 'Ukuran L, warna coklat, dll.', co_submit: 'Kirim Pesanan via WhatsApp',
                cookie_msg: 'Kami memakai penyimpanan lokal untuk keranjang & favorit. Lanjut berarti setuju.',
                cookie_ok: 'OK', top_aria: 'Kembali ke atas',
                ts_out: 'Stok produk habis!', ts_left: 'Stok tersisa {max} pcs!',
                ts_added: '"{name}" ditambahkan ke keranjang!', ts_max: 'Maksimal {max} pcs (stok tersedia)!',
                ts_empty: 'Keranjang kosong!', ts_over: '"{name}" melebihi stok ({max})!',
                ts_fill: 'Harap isi nama, telepon, dan alamat!', ts_phonebad: 'Nomor telepon tidak valid!',
                ts_sent: 'Pesanan dikirim ke WhatsApp!', ts_favadd: 'Ditambahkan ke favorit!', ts_favdel: 'Dihapus dari favorit!',
                ts_revfill: 'Isi nama dan ulasan dulu!', ts_revthanks: 'Terima kasih atas ulasannya!',
                ts_waopen: 'Membuka percakapan WhatsApp...', ts_copied: 'Link produk disalin!', ts_copyfail: 'Gagal menyalin link',
                ts_made: 'Pesanan "{name}" berhasil dibuat! Mengalihkan ke checkout...',
                ts_cfill: 'Isi nama dan pesan!', ts_cwa: 'Membuka WhatsApp...'
            },
            en: {
                nav_beranda: 'Home', nav_katalog: 'Catalog', nav_tentang: 'About', nav_kontak: 'Contact',
                nav_portofolio: 'Portfolio', nav_admin: 'Admin', cart_aria: 'Cart', lang_aria: 'Choose language',
                off_msg: 'You are offline — the catalog may not update. Check your connection.',
                loader_back: 'Back to portfolio...',
                hero_eyebrow: 'Exclusive 2026 Collection',
                hero_title: '<em>Premium</em> Batik<br>from Artisans’ Hands',
                hero_sub: 'I work directly with artisans in Solo, Pekalongan, and Lasem. I hand-pick every motif — only the ones that pass curation end up for sale here.',
                hero_shop: 'Shop Now', hero_story: 'Our Story',
                hero_note: 'each stock item photographed with my own phone ->',
                hero_img_alt: 'Kainara Studio Batik Collection',
                promo_badge: 'FLASH SALE — LIMITED!',
                promo_title: 'Up to <span class="promo-glow" style="color: #D97706;">50%</span> Off',
                promo_sub: 'Selected batik pieces at special prices. Valid while stock lasts — don’t miss out!',
                promo_limited: 'Limited stock!', promo_cta: 'Claim Discount Now',
                promo_img_alt: 'Batik Promo',
                marquee: 'Hand-drawn Batik <span class="o">✦</span> Stamped Batik <span class="o">✦</span> Solo Artisans <span class="o">✦</span> Pekalongan <span class="o">✦</span> Lasem <span class="o">✦</span> Order via WhatsApp <span class="o">✦</span>&nbsp;',
                cat_eyebrow: 'Product Catalog', cat_title: 'Selected Batik Collection',
                cat_sub: 'Every cloth is made with great care — from fabric choice to motif sharpness.',
                search_ph: 'Search product name, motif, description...', search_aria: 'Search products',
                all_cat: 'All Categories', sort_l: 'Sort',
                sort_lo: 'Price: Low', sort_hi: 'Price: High', sort_az: 'Name: A-Z', sort_za: 'Name: Z-A',
                min_ph: 'Min Rp', max_ph: 'Max Rp', min_aria: 'Minimum price', max_aria: 'Maximum price',
                fav: '♥ Favorites', fav_aria: 'Favorites only', best: '🔥 Best Sellers', best_aria: 'Best sellers only',
                loading: 'Loading the batik collection...',
                err_title: 'Failed to Load Products', retry: 'Try Again',
                empty_title: 'No Products Found', empty_sub: 'Try different keywords or another category',
                reset: 'Reset Filters',
                count_all: '{total} products', count_some: '{shown} of {total} products',
                card_avail: 'In stock', card_left: '{n} left', card_out: 'Sold out',
                card_detail: 'Details', card_add_aria: 'Add to cart', card_wish_aria: 'Favorite',
                card_best: 'Best Seller', card_new: 'New', card_nodesc: 'No description.', card_defcat: 'Batik',
                pag_aria: 'Product pages navigation',
                steps_eyebrow: 'Easy, no hassle', steps_title: 'How to Order',
                steps_sub: 'No automatic checkout button — everything goes through chat, so you can ask first.',
                s1t: 'Pick your batik', s1d: 'Scroll the catalog, click a product to see details, stock, and other buyers’ reviews.',
                s2t: 'Click order via WhatsApp', s2d: 'Straight from the product page, the cart, or all at once at checkout. The message is pre-filled.',
                s3t: 'Pay & parcel ships', s3d: 'Transfer after I confirm stock. Neatly packed, shipped within 2x24 hours max.',
                steps_note: 'Still confused? Just chat first — asking is free, no purchase required.',
                about_eyebrow: 'About Us', about_title: 'Why I sell batik',
                quote: '"It started with helping sell leftover cloth from a neighbor artisan in Solo. Turns out many people liked it. So here I am, taking it seriously."',
                cite: '— Erlangga, owner of Kainara Studio',
                p1: 'I don’t have a physical store. I do everything myself: product photos, catalog uploads, packing parcels, replying to chats. So if a reply takes a while, please understand — I’m probably at the post office.',
                r1t: 'I pick the motifs myself.', r1d: 'I don’t take every cloth from the artisans — only ones with comfy fabric and neat stitching.',
                r2t: 'Fair prices, not tourist prices.', r2d: 'With no middlemen, the margin goes back into the price, not all into my own pocket.',
                r3t: 'Wrong item? Exchange it.', r3d: 'Just send a photo of the item and I’ll send a replacement. It’s only happened twice so far.',
                xp: 'Years<br>of Craft',
                about_img_alt: 'Batik-making process', about_mini_alt: 'Batik motif detail',
                testi_eyebrow: 'Testimonials', testi_title: 'What Do They Say?',
                testi_sub: 'Real stories from customers happy with our selected batik.',
                t1: '"The batik is so elegant and premium. The fabric is cool, stitching neat. Bought 3 times here, always satisfied!"',
                t2: '"A batik shirt for an office event. Unique motif, not mainstream. Fast shipping and neat packaging."',
                t3: '"The batik gown is so beautiful! Perfect for weddings. The admin is friendly and fast response. Recommended!"',
                ct_eyebrow: 'Contact Us', ct_title: 'Need Help?<br>We’re Ready to Serve',
                wa_l: 'WhatsApp', wa_s: 'Chat Admin', em_l: 'Email', ig_l: 'Instagram', tt_l: 'TikTok',
                form_t: 'Quick Message', name_ph: 'Your Name', phone_ph: 'WhatsApp No. (optional)',
                msg_ph: 'Write your message...', send: 'Send via WhatsApp',
                ft_tag: 'Carrying on Indonesia’s batik heritage with a modern touch. Every motif has a story, every cloth has a soul.',
                ft_nav: 'Navigate', ft_cat: 'Categories', ft_info: 'Information',
                ft_about: 'About Us', ft_contact: 'Contact', ft_admin: 'Admin Panel',
                ft_special: 'Special Collection', ft_how: 'How to Order', ft_help: 'Contact & Help', ft_top: 'Back to Top',
                ft_copy: '&copy; 2026 Kainara Studio — handmade with HTML + Supabase, no store template.',
                ft_dev: 'Developer Portfolio',
                m_how: 'Choose How to Buy:', m_add: 'Add to Cart', m_wa: 'Order via WhatsApp',
                m_stock: 'Stock Available:', m_pcs: 'pcs', m_rel: 'Related Products', m_rev: 'Buyer Reviews',
                rev_name_ph: 'Name', rev_text_ph: 'Write a review...', rev_send: 'Submit Review',
                no_rel: 'No related products yet.',
                rev_count: ' ({n} reviews)', no_rev_short: 'No reviews yet', no_rev: 'No reviews yet. Be the first!',
                c_title: 'Shopping Cart', c_empty: 'Cart is empty', c_total: 'Total',
                c_checkout: 'Checkout', c_clear: 'Clear Cart', c_confirm: 'Clear the cart?',
                c_dec: 'Decrease', c_inc: 'Increase', c_del: 'Remove',
                c_hist: 'Order History ({n})', c_item: 'items',
                co_title: 'Checkout Order', co_sum: 'Order Summary', co_total: 'Total', co_self: 'Your Details',
                co_name: 'Full Name', co_phone: 'Phone / WhatsApp No.', co_addr: 'Shipping Address', co_note: 'Notes (Optional)',
                co_name_ph: 'Jane Doe', co_phone_ph: '0812xxxxxxx', co_addr_ph: '10 Merdeka St, South Jakarta',
                co_note_ph: 'Size L, brown color, etc.', co_submit: 'Send Order via WhatsApp',
                cookie_msg: 'We use local storage for cart & favorites. Continuing means you agree.',
                cookie_ok: 'OK', top_aria: 'Back to top',
                ts_out: 'Product is out of stock!', ts_left: 'Only {max} pcs left!',
                ts_added: '"{name}" added to cart!', ts_max: 'Maximum {max} pcs (available stock)!',
                ts_empty: 'Cart is empty!', ts_over: '"{name}" exceeds stock ({max})!',
                ts_fill: 'Please fill in name, phone, and address!', ts_phonebad: 'Invalid phone number!',
                ts_sent: 'Order sent to WhatsApp!', ts_favadd: 'Added to favorites!', ts_favdel: 'Removed from favorites!',
                ts_revfill: 'Fill in name and review first!', ts_revthanks: 'Thanks for your review!',
                ts_waopen: 'Opening WhatsApp chat...', ts_copied: 'Product link copied!', ts_copyfail: 'Failed to copy link',
                ts_made: 'Order "{name}" created! Redirecting to checkout...',
                ts_cfill: 'Fill in name and message!', ts_cwa: 'Opening WhatsApp...'
            },
            ja: {
                nav_beranda: 'ホーム', nav_katalog: 'カタログ', nav_tentang: '紹介', nav_kontak: '連絡',
                nav_portofolio: 'ポートフォリオ', nav_admin: '管理', cart_aria: 'カート', lang_aria: '言語を選ぶ',
                off_msg: 'オフラインです — カタログが更新されない場合があります。接続を確認してください。',
                loader_back: 'ポートフォリオに戻る...',
                hero_eyebrow: '2026年限定コレクション',
                hero_title: '<em>プレミアム</em>バティック<br>職人の心から',
                hero_sub: 'ソロ、プカロガン、ラセムの職人と直接提携しています。すべての柄を自分で選び、審査に通ったものだけを販売しています。',
                hero_shop: '今すぐ買う', hero_story: '私たちの物語',
                hero_note: '在庫は自分のスマホで一枚ずつ撮影 ->',
                hero_img_alt: 'カイナラ・スタジオのバティックコレクション',
                promo_badge: 'フラッシュセール — 期間限定！',
                promo_title: '最大<span class="promo-glow" style="color: #D97706;">50%</span>オフ',
                promo_sub: '厳選バティックが特別価格。在庫がなくなり次第終了 — お見逃しなく！',
                promo_limited: '在庫わずか！', promo_cta: '今すぐ割引を使う',
                promo_img_alt: 'バティックのプロモーション',
                marquee: '手描きバティック <span class="o">✦</span> 型押しバティック <span class="o">✦</span> ソロの職人 <span class="o">✦</span> プカロガン <span class="o">✦</span> ラセム <span class="o">✦</span> WhatsAppで注文 <span class="o">✦</span>&nbsp;',
                cat_eyebrow: '商品カタログ', cat_title: '厳選バティックコレクション',
                cat_sub: '生地選びから柄の鮮明さまで、一枚一枚丁寧に作られています。',
                search_ph: '商品名、柄、説明を検索...', search_aria: '商品を検索',
                all_cat: 'すべてのカテゴリ', sort_l: '並び替え',
                sort_lo: '価格：安い順', sort_hi: '価格：高い順', sort_az: '名前：A-Z', sort_za: '名前：Z-A',
                min_ph: '最低 Rp', max_ph: '最高 Rp', min_aria: '最低価格', max_aria: '最高価格',
                fav: '♥ お気に入り', fav_aria: 'お気に入りのみ', best: '🔥 売れ筋', best_aria: '売れ筋のみ',
                loading: 'バティックコレクションを読み込み中...',
                err_title: '商品の読み込みに失敗', retry: '再試行',
                empty_title: '商品が見つかりません', empty_sub: 'キーワードやカテゴリを変えてみてください',
                reset: '絞り込みをリセット',
                count_all: '全{total}点', count_some: '{total}点中{shown}点',
                card_avail: '在庫あり', card_left: '残り{n}点', card_out: '売り切れ',
                card_detail: '詳細', card_add_aria: 'カートに入れる', card_wish_aria: 'お気に入り',
                card_best: '売れ筋', card_new: '新着', card_nodesc: '説明がありません。', card_defcat: 'バティック',
                pag_aria: '商品ページのナビ',
                steps_eyebrow: '簡単、面倒なし', steps_title: '注文方法',
                steps_sub: '自動決済ボタンはありません — すべてチャット経由なので、まず質問できます。',
                s1t: 'バティックを選ぶ', s1d: 'カタログをスクロールし、商品をクリックして詳細・在庫・他の購入者のレビューを確認。',
                s2t: 'WhatsAppで注文をクリック', s2d: '商品ページ、カート、まとめ買いのチェックアウトから直接どうぞ。メッセージは自動入力済み。',
                s3t: '支払い＆発送', s3d: '在庫確認後にお振込み。丁寧に梱包し、最大48時間以内に発送します。',
                steps_note: '分からないことがあれば、まずチャットで — 質問だけでも無料、購入は必須ではありません。',
                about_eyebrow: '私たちについて', about_title: 'なぜバティックを売るのか',
                quote: '"始まりは、ソロの職人である近所の人の残布販売を手伝ったことでした。意外と好評で。それで、本気でやることにしました。"',
                cite: '— エルランガ、カイナラ・スタジオ店主',
                p1: '実店舗はありません。商品撮影、カタログ登録、梱包、チャット対応まで全部一人でやっています。返信が遅いときはご容赦ください — たぶん郵便局に行っています。',
                r1t: '柄は自分で選びます。', r1d: '職人の布を全部仕入れるわけではなく — 肌触りがよく縫製が丁寧なものだけです。',
                r2t: '適正価格、観光客価格ではありません。', r2d: '中間業者がいない分、その差額は価格に還元し、全部自分の懐には入れません。',
                r3t: '誤送？交換します。', r3d: '商品の写真を送っていただければ、代替品を送ります。これまで2回だけ起きました。',
                xp: '年の<br>職歴',
                about_img_alt: 'バティック制作の工程', about_mini_alt: 'バティック柄の細部',
                testi_eyebrow: 'お客様の声', testi_title: '皆さんの声は？',
                testi_sub: '厳選バティックに満足したお客様のリアルな声。',
                t1: '"バティックがとても上品でプレミアム。生地は涼しく、縫製も丁寧。ここで3回買いましたが、いつも満足です！"',
                t2: '"会社の行事用のバティックシャツ。柄が uniqueness があって他にない。発送が速く梱包も丁寧。"',
                t3: '"バティックドレスがとても素敵！結婚式にぴったり。店員さんが親切で返信も速い。おすすめ！"',
                ct_eyebrow: 'お問い合わせ', ct_title: 'お困りですか？<br>喜んで対応します',
                wa_l: 'WhatsApp', wa_s: '管理者にチャット', em_l: 'メール', ig_l: 'Instagram', tt_l: 'TikTok',
                form_t: 'クイックメッセージ', name_ph: 'お名前', phone_ph: 'WhatsApp番号（任意）',
                msg_ph: 'メッセージを書く...', send: 'WhatsAppで送信',
                ft_tag: 'インドネシアのバティックの遺産を現代的な感覚で受け継ぐ。すべての柄に物語があり、すべての布に魂があります。',
                ft_nav: 'メニュー', ft_cat: 'カテゴリ', ft_info: '案内',
                ft_about: '私たちについて', ft_contact: '連絡先', ft_admin: '管理パネル',
                ft_special: '特別コレクション', ft_how: '注文方法', ft_help: '連絡＆ヘルプ', ft_top: 'トップに戻る',
                ft_copy: '&copy; 2026 カイナラ・スタジオ — HTML + Supabaseで自作、店舗テンプレート不使用。',
                ft_dev: '開発者ポートフォリオ',
                m_how: '購入方法を選ぶ：', m_add: 'カートに入れる', m_wa: 'WhatsAppで注文',
                m_stock: '在庫あり：', m_pcs: '点', m_rel: '関連商品', m_rev: '購入者のレビュー',
                rev_name_ph: '名前', rev_text_ph: 'レビューを書く...', rev_send: 'レビューを送信',
                no_rel: '関連商品はまだありません。',
                rev_count: '（{n}件のレビュー）', no_rev_short: 'レビューはまだありません', no_rev: 'レビューはまだありません。最初のレビューを書こう！',
                c_title: 'ショッピングカート', c_empty: 'カートは空です', c_total: '合計',
                c_checkout: 'レジへ', c_clear: 'カートを空にする', c_confirm: 'カートを空にしますか？',
                c_dec: '減らす', c_inc: '増やす', c_del: '削除',
                c_hist: '注文履歴（{n}）', c_item: '点',
                co_title: '注文の確定', co_sum: '注文内容', co_total: '合計', co_self: 'お客様情報',
                co_name: '氏名', co_phone: '電話 / WhatsApp番号', co_addr: '配送先住所', co_note: '備考（任意）',
                co_name_ph: '山田 花子', co_phone_ph: '0812xxxxxxx', co_addr_ph: 'Jl. Merdeka No. 10, Jakarta Selatan',
                co_note_ph: 'Lサイズ、茶色など', co_submit: 'WhatsAppで注文を送信',
                cookie_msg: 'カートとお気に入りにローカル保存を使います。続けると同意したことになります。',
                cookie_ok: 'OK', top_aria: 'トップに戻る',
                ts_out: '在庫切れです！', ts_left: '残り{max}点です！',
                ts_added: '「{name}」をカートに入れました！', ts_max: '上限{max}点です（在庫分）！',
                ts_empty: 'カートは空です！', ts_over: '「{name}」が在庫（{max}）を超えています！',
                ts_fill: '氏名・電話・住所を入力してください！', ts_phonebad: '電話番号が無効です！',
                ts_sent: '注文をWhatsAppに送信しました！', ts_favadd: 'お気に入りに追加しました！', ts_favdel: 'お気に入りから削除しました！',
                ts_revfill: '名前とレビューを先に入力してください！', ts_revthanks: 'レビューありがとうございます！',
                ts_waopen: 'WhatsAppのチャットを開いています...', ts_copied: '商品リンクをコピーしました！', ts_copyfail: 'リンクのコピーに失敗',
                ts_made: '注文「{name}」を作成しました！チェックアウトへ移動します...',
                ts_cfill: '名前とメッセージを入力してください！', ts_cwa: 'WhatsAppを開いています...'
            },
            ar: {
                nav_beranda: 'الرئيسية', nav_katalog: 'الكتالوج', nav_tentang: 'من نحن', nav_kontak: 'اتصل بنا',
                nav_portofolio: 'أعمالي', nav_admin: 'الإدارة', cart_aria: 'السلة', lang_aria: 'اختر اللغة',
                off_msg: 'أنت غير متصل — قد لا يتم تحديث الكتالوج. تحقق من الاتصال.',
                loader_back: 'عودة إلى الأعمال...',
                hero_eyebrow: 'مجموعة 2026 الحصرية',
                hero_title: 'باتيك <em>فاخر</em><br>من قلوب الحرفيين',
                hero_sub: 'أتعامل مباشرة مع حرفيين في سولو وبيكالونغان ولاسم. أختار كل نقش بنفسي — فقط ما يجتاز الفرز يُعرض للبيع هنا.',
                hero_shop: 'تسوّق الآن', hero_story: 'قصتنا',
                hero_note: 'كل قطعة صوّرتها بهاتفي واحدًا واحدًا ->',
                hero_img_alt: 'مجموعة باتيك كاينارا ستوديو',
                promo_badge: 'تخفيضات فلاش — لفترة محدودة!',
                promo_title: 'خصم حتى <span class="promo-glow" style="color: #D97706;">50%</span>',
                promo_sub: 'قطع باتيك مختارة بأسعار خاصة. سارٍ حتى نفاد المخزون — لا تفوّت الفرصة!',
                promo_limited: 'المخزون محدود!', promo_cta: 'احصل على الخصم الآن',
                promo_img_alt: 'عرض الباتيك',
                marquee: 'باتيك مرسوم يدويًا <span class="o">✦</span> باتيك مختوم <span class="o">✦</span> حرفيو سولو <span class="o">✦</span> بيكالونغان <span class="o">✦</span> لاسم <span class="o">✦</span> اطلب عبر واتساب <span class="o">✦</span>&nbsp;',
                cat_eyebrow: 'كتالوج المنتجات', cat_title: 'مجموعة باتيك مختارة',
                cat_sub: 'كل قطعة قماش تُصنع بعناية فائقة — من اختيار الخامة إلى حدة النقش.',
                search_ph: 'ابحث باسم المنتج أو النقش أو الوصف...', search_aria: 'ابحث في المنتجات',
                all_cat: 'كل الفئات', sort_l: 'ترتيب',
                sort_lo: 'السعر: الأقل', sort_hi: 'السعر: الأعلى', sort_az: 'الاسم: أ-ي', sort_za: 'الاسم: ي-أ',
                min_ph: 'أدنى Rp', max_ph: 'أقصى Rp', min_aria: 'السعر الأدنى', max_aria: 'السعر الأقصى',
                fav: '♥ المفضلة', fav_aria: 'المفضلة فقط', best: '🔥 الأكثر مبيعًا', best_aria: 'الأكثر مبيعًا فقط',
                loading: 'جارٍ تحميل مجموعة الباتيك...',
                err_title: 'فشل تحميل المنتجات', retry: 'حاول مجددًا',
                empty_title: 'لا توجد منتجات', empty_sub: 'جرّب كلمات أخرى أو فئة مختلفة',
                reset: 'إعادة ضبط المرشحات',
                count_all: '{total} منتجات', count_some: '{shown} من {total} منتجات',
                card_avail: 'متوفر', card_left: 'بقي {n}', card_out: 'نفد',
                card_detail: 'التفاصيل', card_add_aria: 'أضف إلى السلة', card_wish_aria: 'مفضلة',
                card_best: 'الأكثر مبيعًا', card_new: 'جديد', card_nodesc: 'لا يوجد وصف.', card_defcat: 'باتيك',
                pag_aria: 'التنقل بين صفحات المنتجات',
                steps_eyebrow: 'سهل وبدون تعقيد', steps_title: 'طريقة الطلب',
                steps_sub: 'لا يوجد زر دفع تلقائي — كل شيء عبر المحادثة لتتمكن من السؤال أولًا.',
                s1t: 'اختر الباتيك', s1d: 'تصفح الكتالوج واضغط على المنتج لرؤية التفاصيل والمخزون وآراء المشترين.',
                s2t: 'اضغط الطلب عبر واتساب', s2d: 'مباشرة من صفحة المنتج أو السلة أو الدفع الجماعي. الرسالة معبأة تلقائيًا.',
                s3t: 'ادفع ويُشحن الطرد', s3d: 'حوّل بعد تأكيد المخزون. تغليف أنيق وشحن خلال 48 ساعة كحد أقصى.',
                steps_note: 'ما زلت محتارًا؟ راسلني أولًا — السؤال مجاني ولا يلزمك الشراء.',
                about_eyebrow: 'من نحن', about_title: 'لماذا أبيع الباتيك',
                quote: '"بدأ الأمر بمساعدة جار حرفي في سولو على بيع بقايا الأقمشة. اتضح أن الكثيرين أعجبوا بها. حسنًا، أخذت الأمر بجدية."',
                cite: '— إرلانغا، صاحب كاينارا ستوديو',
                p1: 'ليس لدي متجر فعلي. أفعل كل شيء بنفسي: تصوير المنتجات ورفع الكتالوج وتغليف الطرود والرد على الرسائل. فإذا تأخر الرد فاعذرني — على الأرجح أنا في مكتب البريد.',
                r1t: 'أختار النقوش بنفسي.', r1d: 'لا آخذ كل أقمشة الحرفيين — فقط ما خامته مريحة وخياطته متقنة.',
                r2t: 'أسعار عادلة وليست أسعار سياح.', r2d: 'بدون وسطاء، يعود الفرق إلى السعر ولا يدخل كله جيبي.',
                r3t: 'خطأ في الشحن؟ نستبدله.', r3d: 'فقط صوّر المنتج وسأرسل بديلًا. حدث ذلك مرتين فقط حتى الآن.',
                xp: 'عامًا<br>من الحرفة',
                about_img_alt: 'عملية صناعة الباتيك', about_mini_alt: 'تفاصيل نقش الباتيك',
                testi_eyebrow: 'آراء العملاء', testi_title: 'ماذا يقولون؟',
                testi_sub: 'قصص حقيقية من عملاء سعداء بالباتيك المختار.',
                t1: '"الباتيك أنيق وفاخر جدًا. الخامة مريحة والخياطة متقنة. اشتريت 3 مرات ودائمًا راضٍ!"',
                t2: '"قميص باتيك لمناسبة عمل. نقش مميز وغير منتشر. شحن سريع وتغليف أنيق."',
                t3: '"فستان الباتيك جميل جدًا! مناسب للحفلات. الإدارة لطيفة وسريعة الرد. أنصح به!"',
                ct_eyebrow: 'اتصل بنا', ct_title: 'تحتاج مساعدة؟<br>نحن جاهزون لخدمتك',
                wa_l: 'واتساب', wa_s: 'راسل الإدارة', em_l: 'البريد', ig_l: 'إنستغرام', tt_l: 'تيك توك',
                form_t: 'رسالة سريعة', name_ph: 'اسمك', phone_ph: 'رقم واتساب (اختياري)',
                msg_ph: 'اكتب رسالتك...', send: 'إرسال عبر واتساب',
                ft_tag: 'نحمل تراث الباتيك الإندونيسي بلمسة عصرية. لكل نقش حكاية ولكل قماش روح.',
                ft_nav: 'تصفح', ft_cat: 'الفئات', ft_info: 'معلومات',
                ft_about: 'من نحن', ft_contact: 'اتصل بنا', ft_admin: 'لوحة الإدارة',
                ft_special: 'مجموعة خاصة', ft_how: 'طريقة الطلب', ft_help: 'اتصل ومساعدة', ft_top: 'عودة للأعلى',
                ft_copy: '&copy; 2026 كاينارا ستوديو — صُنع يدويًا بـ HTML + Supabase وبدون قالب متجر.',
                ft_dev: 'أعمال المطور',
                m_how: 'اختر طريقة الشراء:', m_add: 'أضف إلى السلة', m_wa: 'اطلب عبر واتساب',
                m_stock: 'المخزون المتاح:', m_pcs: 'قطعة', m_rel: 'منتجات ذات صلة', m_rev: 'آراء المشترين',
                rev_name_ph: 'الاسم', rev_text_ph: 'اكتب رأيك...', rev_send: 'إرسال الرأي',
                no_rel: 'لا توجد منتجات ذات صلة بعد.',
                rev_count: ' ({n} تقييمات)', no_rev_short: 'لا توجد تقييمات بعد', no_rev: 'لا توجد تقييمات بعد. كن أول من يقيّم!',
                c_title: 'سلة التسوق', c_empty: 'السلة فارغة', c_total: 'المجموع',
                c_checkout: 'الدفع', c_clear: 'إفراغ السلة', c_confirm: 'إفراغ السلة؟',
                c_dec: 'إنقاص', c_inc: 'زيادة', c_del: 'حذف',
                c_hist: 'سجل الطلبات ({n})', c_item: 'عناصر',
                co_title: 'إتمام الطلب', co_sum: 'ملخص الطلب', co_total: 'المجموع', co_self: 'بياناتك',
                co_name: 'الاسم الكامل', co_phone: 'الهاتف / واتساب', co_addr: 'عنوان الشحن', co_note: 'ملاحظات (اختياري)',
                co_name_ph: 'سيتي رحايو', co_phone_ph: '0812xxxxxxx', co_addr_ph: 'شارع مرديكا 10، جنوب جاكرتا',
                co_note_ph: 'مقاس L، لون بني، إلخ.', co_submit: 'إرسال الطلب عبر واتساب',
                cookie_msg: 'نستخدم التخزين المحلي للسلة والمفضلة. الاستمرار يعني الموافقة.',
                cookie_ok: 'حسنًا', top_aria: 'عودة للأعلى',
                ts_out: 'نفد مخزون المنتج!', ts_left: 'بقي {max} قطع فقط!',
                ts_added: 'أُضيف "{name}" إلى السلة!', ts_max: 'الحد الأقصى {max} قطع (المتاح)!',
                ts_empty: 'السلة فارغة!', ts_over: '"{name}" يتجاوز المخزون ({max})!',
                ts_fill: 'املأ الاسم والهاتف والعنوان!', ts_phonebad: 'رقم الهاتف غير صالح!',
                ts_sent: 'أُرسل الطلب إلى واتساب!', ts_favadd: 'أُضيف إلى المفضلة!', ts_favdel: 'أُزيل من المفضلة!',
                ts_revfill: 'املأ الاسم والرأي أولًا!', ts_revthanks: 'شكرًا لرأيك!',
                ts_waopen: 'جارٍ فتح محادثة واتساب...', ts_copied: 'نُسخ رابط المنتج!', ts_copyfail: 'فشل نسخ الرابط',
                ts_made: 'أُنشئ الطلب "{name}"! جارٍ التحويل للدفع...',
                ts_cfill: 'املأ الاسم والرسالة!', ts_cwa: 'جارٍ فتح واتساب...'
            }
        },

        /* ================= ADMIN (admin.html) ================= */
        admin: {
            id: {
                lock_t: 'Dashboard Terkunci', lock_s: 'Halaman ini khusus pemilik toko. Masukkan PIN admin.',
                lock_ph: 'PIN admin', lock_err: 'PIN salah, coba lagi.', lock_btn: 'Buka Dashboard',
                lock_demo: 'PIN demo untuk asesor: <strong>kainara26</strong>', lock_opening: 'Membuka…',
                brand_s: 'Admin Panel', top_shop: 'Lihat Toko', top_port: 'Portofolio', top_lock: 'Kunci',
                greet: 'Halo, Bos. <em>👋</em>', greet_s: 'Ini kondisi tokomu hari ini — ',
                st_prod: 'Total Produk', st_prod_s: 'Klik: tampilkan semua',
                st_stock: 'Total Stok', st_stock_s: 'Unit di gudang',
                st_val: 'Nilai Inventaris', st_val_s: 'Harga × stok',
                st_low: 'Stok Menipis', st_low_s: 'Klik: filter ≤ 5',
                banner: 'Ada produk yang stoknya menipis.', banner_btn: 'Tampilkan',
                search_ph: 'Cari nama, kategori, deskripsi…',
                sort_new: 'Terbaru dulu', sort_lo: 'Harga: termurah', sort_hi: 'Harga: termahal',
                sort_low: 'Stok: tersedikit', sort_az: 'Nama: A–Z',
                chip: 'Stok ≤ 5', add: 'Tambah Produk', prev: 'Sebelumnya', next: 'Berikutnya',
                modal_add: 'Tambah Produk Baru', modal_edit: 'Edit Produk',
                modal_req: 'Semua kolom bertanda <span class="text-danger">*</span> wajib diisi.',
                f_name: 'Nama Produk', f_name_ph: 'Contoh: Kemeja Batik Parang',
                f_cat: 'Kategori', f_cat_ph: 'Pilih Kategori...',
                f_price: 'Harga (Rp)', f_stock: 'Stok', f_img: 'Gambar Produk',
                f_up: 'Upload dari Komputer (maks 2MB)', f_url: 'Atau masukkan URL Gambar',
                f_desc: 'Deskripsi', f_desc_ph: 'Motif apa, bahan apa, cocok untuk acara apa…',
                f_cancel: 'Batal', f_save: 'Simpan Produk', f_clear: 'Hapus', f_saving: 'Menyimpan...',
                go_opening: 'Membuka…', lang_aria: 'Pilih bahasa',
                a_loadfail: 'Gagal memuat data: ', a_stockfail: 'Gagal update stok: ',
                a_all: 'Semua ({n})', a_showing: 'Menampilkan {a}–{b} dari {total} produk', a_none: 'Tidak ada produk',
                a_empty_t1: 'Tidak ketemu', a_empty_t2: 'Etalase masih kosong',
                a_empty_d: 'Tambahkan produk pertamamu — langsung tampil di katalog toko.',
                a_addfirst: 'Tambah Produk Pertama', a_stock: 'Stok: {n}',
                a_edit: 'Edit', a_del: 'Hapus', a_add1: 'Tambah 1',
                a_del_t: 'Hapus produk?', a_del_h: '<strong>{name}</strong> akan dihapus permanen dari katalog.',
                a_del_ok_t: 'Terhapus!', a_del_ok_x: 'Produk berhasil dihapus.',
                a_deleted: 'Produk berhasil dihapus!', a_delfail: 'Gagal menghapus: ',
                a_saved: 'Tersimpan!', a_savefail: 'Gagal menyimpan: ',
                a_name3: 'Nama produk minimal 3 huruf.', a_price0: 'Harga harus lebih dari Rp 0.', a_stockneg: 'Stok tidak boleh negatif.',
                a_confirm_yes: 'Ya, hapus!', a_cat: 'Pilih kategorinya dulu.', a_img: 'Harap pilih gambar atau masukkan URL gambar!',
                a_desc10: 'Deskripsi minimal 10 karakter — ceritain motif & bahannya.',
                a_updated: 'Produk berhasil diperbarui!', a_added: 'Produk baru berhasil ditambahkan!',
                a_clearfilter: 'Bersihkan Filter', a_tryother: 'Coba kata kunci lain, atau bersihkan filter di bawah.',
                a_stockdec: 'Kurangi 1', a_close: 'Tutup', a_fail: 'Gagal!',
                a_loading: 'Memuat…', a_out: 'Habis', a_low: '{n} Menipis', a_ok: '{n} Tersedia',
                a_banner: '{n} produk stoknya ≤ {low} — restock sebelum kehabisan.',
            },
            en: {
                lock_t: 'Dashboard Locked', lock_s: 'This page is for the store owner only. Enter the admin PIN.',
                lock_ph: 'Admin PIN', lock_err: 'Wrong PIN, try again.', lock_btn: 'Open Dashboard',
                lock_demo: 'Demo PIN for assessor: <strong>kainara26</strong>', lock_opening: 'Opening…',
                brand_s: 'Admin Panel', top_shop: 'View Store', top_port: 'Portfolio', top_lock: 'Lock',
                greet: 'Hey, Boss. <em>👋</em>', greet_s: 'Here is your store today — ',
                st_prod: 'Total Products', st_prod_s: 'Click: show all',
                st_stock: 'Total Stock', st_stock_s: 'Units in warehouse',
                st_val: 'Inventory Value', st_val_s: 'Price × stock',
                st_low: 'Low Stock', st_low_s: 'Click: filter ≤ 5',
                banner: 'Some products are running low.', banner_btn: 'Show',
                search_ph: 'Search name, category, description…',
                sort_new: 'Newest first', sort_lo: 'Price: lowest', sort_hi: 'Price: highest',
                sort_low: 'Stock: lowest', sort_az: 'Name: A–Z',
                chip: 'Stock ≤ 5', add: 'Add Product', prev: 'Previous', next: 'Next',
                modal_add: 'Add New Product', modal_edit: 'Edit Product',
                modal_req: 'All fields marked <span class="text-danger">*</span> are required.',
                f_name: 'Product Name', f_name_ph: 'E.g.: Parang Batik Shirt',
                f_cat: 'Category', f_cat_ph: 'Choose Category...',
                f_price: 'Price (Rp)', f_stock: 'Stock', f_img: 'Product Image',
                f_up: 'Upload from Computer (max 2MB)', f_url: 'Or paste Image URL',
                f_desc: 'Description', f_desc_ph: 'Which motif, which fabric, good for what occasion…',
                f_cancel: 'Cancel', f_save: 'Save Product', f_clear: 'Remove', f_saving: 'Saving...',
                go_opening: 'Opening…', lang_aria: 'Choose language',
                a_loadfail: 'Failed to load data: ', a_stockfail: 'Failed to update stock: ',
                a_all: 'All ({n})', a_showing: 'Showing {a}–{b} of {total} products', a_none: 'No products',
                a_empty_t1: 'Not found', a_empty_t2: 'Shelf is still empty',
                a_empty_d: 'Add your first product — it shows in the store catalog right away.',
                a_addfirst: 'Add First Product', a_stock: 'Stock: {n}',
                a_edit: 'Edit', a_del: 'Delete', a_add1: 'Add 1',
                a_del_t: 'Delete product?', a_del_h: '<strong>{name}</strong> will be permanently removed from the catalog.',
                a_del_ok_t: 'Deleted!', a_del_ok_x: 'Product deleted successfully.',
                a_deleted: 'Product deleted successfully!', a_delfail: 'Failed to delete: ',
                a_saved: 'Saved!', a_savefail: 'Failed to save: ',
                a_name3: 'Product name needs at least 3 characters.', a_price0: 'Price must be more than Rp 0.', a_stockneg: 'Stock cannot be negative.',
                a_confirm_yes: 'Yes, delete!', a_cat: 'Choose the category first.', a_img: 'Please pick an image or paste an image URL!',
                a_desc10: 'Description needs at least 10 characters — tell the motif & fabric.',
                a_updated: 'Product updated successfully!', a_added: 'New product added successfully!',
                a_clearfilter: 'Clear Filters', a_tryother: 'Try other keywords, or clear the filters below.',
                a_stockdec: 'Decrease by 1', a_close: 'Close', a_fail: 'Failed!',
                a_loading: 'Loading…', a_out: 'Out', a_low: '{n} low', a_ok: '{n} available',
                a_banner: '{n} products at ≤ {low} stock — restock before they run out.',
            },
            ja: {
                lock_t: 'ダッシュボードはロック中', lock_s: 'このページは店主専用です。管理者PINを入力してください。',
                lock_ph: '管理者PIN', lock_err: 'PINが違います。もう一度。', lock_btn: 'ダッシュボードを開く',
                lock_demo: '審査員用デモPIN： <strong>kainara26</strong>', lock_opening: '開いています…',
                brand_s: '管理パネル', top_shop: '店舗を見る', top_port: 'ポートフォリオ', top_lock: 'ロック',
                greet: 'こんにちは、店長。<em>👋</em>', greet_s: '今日のお店の様子 — ',
                st_prod: '商品総数', st_prod_s: 'クリック：すべて表示',
                st_stock: '在庫総数', st_stock_s: '倉庫の点数',
                st_val: '在庫価値', st_val_s: '価格 × 在庫',
                st_low: '在庫わずか', st_low_s: 'クリック：≤ 5で絞り込み',
                banner: '在庫がわずかな商品があります。', banner_btn: '表示',
                search_ph: '名前・カテゴリ・説明を検索…',
                sort_new: '新しい順', sort_lo: '価格：安い順', sort_hi: '価格：高い順',
                sort_low: '在庫：少ない順', sort_az: '名前：A–Z',
                chip: '在庫 ≤ 5', add: '商品を追加', prev: '前へ', next: '次へ',
                modal_add: '新商品を追加', modal_edit: '商品を編集',
                modal_req: '<span class="text-danger">*</span>の付いた項目は必須です。',
                f_name: '商品名', f_name_ph: '例：バティックシャツ・パラン',
                f_cat: 'カテゴリ', f_cat_ph: 'カテゴリを選ぶ...',
                f_price: '価格（Rp）', f_stock: '在庫', f_img: '商品画像',
                f_up: 'パソコンからアップロード（最大2MB）', f_url: 'または画像URLを入力',
                f_desc: '説明', f_desc_ph: 'どんな柄、生地、どんな場面に向くか…',
                f_cancel: 'キャンセル', f_save: '商品を保存', f_clear: '削除', f_saving: '保存中...',
                go_opening: '開いています…', lang_aria: '言語を選ぶ',
                a_loadfail: 'データの読み込みに失敗： ', a_stockfail: '在庫の更新に失敗： ',
                a_all: 'すべて（{n}）', a_showing: '{total}点中{a}–{b}点を表示', a_none: '商品なし',
                a_empty_t1: '見つかりません', a_empty_t2: '棚はまだ空です',
                a_empty_d: '最初の商品を追加しましょう — すぐ店舗カタログに表示されます。',
                a_addfirst: '最初の商品を追加', a_stock: '在庫：{n}',
                a_edit: '編集', a_del: '削除', a_add1: '1つ追加',
                a_del_t: '商品を削除しますか？', a_del_h: '<strong>{name}</strong>はカタログから完全に削除されます。',
                a_del_ok_t: '削除しました！', a_del_ok_x: '商品を削除しました。',
                a_deleted: '商品を削除しました！', a_delfail: '削除に失敗： ',
                a_saved: '保存しました！', a_savefail: '保存に失敗： ',
                a_name3: '商品名は3文字以上にしてください。', a_price0: '価格はRp 0より大きくしてください。', a_stockneg: '在庫をマイナスにできません。',
                a_confirm_yes: 'はい、削除します！', a_cat: 'まずカテゴリを選んでください。', a_img: '画像を選ぶか画像URLを入力してください！',
                a_desc10: '説明は10文字以上 — 柄と生地について書いてください。',
                a_updated: '商品を更新しました！', a_added: '新商品を追加しました！',
                a_clearfilter: '絞り込みをクリア', a_tryother: '他のキーワードを試すか、下の絞り込みをクリアしてください。',
                a_stockdec: '1つ減らす', a_close: '閉じる', a_fail: '失敗！',
                a_loading: '読み込み中…', a_out: '切れ', a_low: '残り{n}', a_ok: '{n}あり',
                a_banner: '{n}点の在庫が{low}以下 — なくなる前に補充しましょう。',
            },
            ar: {
                lock_t: 'اللوحة مقفلة', lock_s: 'هذه الصفحة لصاحب المتجر فقط. أدخل رمز الإدارة.',
                lock_ph: 'رمز الإدارة', lock_err: 'الرمز خطأ، حاول مجددًا.', lock_btn: 'افتح اللوحة',
                lock_demo: 'رمز العرض للمقيّم: <strong>kainara26</strong>', lock_opening: 'جارٍ الفتح…',
                brand_s: 'لوحة الإدارة', top_shop: 'عرض المتجر', top_port: 'أعمالي', top_lock: 'قفل',
                greet: 'مرحبًا أيها المدير. <em>👋</em>', greet_s: 'هذه حالة متجرك اليوم — ',
                st_prod: 'إجمالي المنتجات', st_prod_s: 'اضغط: عرض الكل',
                st_stock: 'إجمالي المخزون', st_stock_s: 'وحدات في المستودع',
                st_val: 'قيمة المخزون', st_val_s: 'السعر × المخزون',
                st_low: 'مخزون منخفض', st_low_s: 'اضغط: تصفية ≤ 5',
                banner: 'بعض المنتجات مخزونها منخفض.', banner_btn: 'عرض',
                search_ph: 'ابحث بالاسم أو الفئة أو الوصف…',
                sort_new: 'الأحدث أولًا', sort_lo: 'السعر: الأقل', sort_hi: 'السعر: الأعلى',
                sort_low: 'المخزون: الأقل', sort_az: 'الاسم: أ–ي',
                chip: 'مخزون ≤ 5', add: 'إضافة منتج', prev: 'السابق', next: 'التالي',
                modal_add: 'إضافة منتج جديد', modal_edit: 'تعديل المنتج',
                modal_req: 'كل الحقول المعلمة <span class="text-danger">*</span> مطلوبة.',
                f_name: 'اسم المنتج', f_name_ph: 'مثال: قميص باتيك بارانغ',
                f_cat: 'الفئة', f_cat_ph: 'اختر الفئة...',
                f_price: 'السعر (Rp)', f_stock: 'المخزون', f_img: 'صورة المنتج',
                f_up: 'رفع من الكمبيوتر (بحد أقصى 2MB)', f_url: 'أو أدخل رابط الصورة',
                f_desc: 'الوصف', f_desc_ph: 'أي نقش وأي خامة ولأي مناسبة…',
                f_cancel: 'إلغاء', f_save: 'حفظ المنتج', f_clear: 'إزالة', f_saving: 'جارٍ الحفظ...',
                go_opening: 'جارٍ الفتح…', lang_aria: 'اختر اللغة',
                a_loadfail: 'فشل تحميل البيانات: ', a_stockfail: 'فشل تحديث المخزون: ',
                a_all: 'الكل ({n})', a_showing: 'عرض {a}–{b} من {total} منتجات', a_none: 'لا توجد منتجات',
                a_empty_t1: 'لا نتائج', a_empty_t2: 'الرف ما زال فارغًا',
                a_empty_d: 'أضف منتجك الأول — سيظهر في كتالوج المتجر فورًا.',
                a_addfirst: 'أضف المنتج الأول', a_stock: 'المخزون: {n}',
                a_edit: 'تعديل', a_del: 'حذف', a_add1: 'إضافة 1',
                a_del_t: 'حذف المنتج؟', a_del_h: 'سيُحذف <strong>{name}</strong> نهائيًا من الكتالوج.',
                a_del_ok_t: 'حُذف!', a_del_ok_x: 'حُذف المنتج بنجاح.',
                a_deleted: 'حُذف المنتج بنجاح!', a_delfail: 'فشل الحذف: ',
                a_saved: 'حُفظ!', a_savefail: 'فشل الحفظ: ',
                a_name3: 'اسم المنتج 3 أحرف على الأقل.', a_price0: 'يجب أن يكون السعر أكبر من Rp 0.', a_stockneg: 'لا يمكن أن يكون المخزون سالبًا.',
                a_confirm_yes: 'نعم، احذف!', a_cat: 'اختر الفئة أولًا.', a_img: 'اختر صورة أو أدخل رابط صورة!',
                a_desc10: 'الوصف 10 أحرف على الأقل — احكِ عن النقش والخامة.',
                a_updated: 'حُدّث المنتج بنجاح!', a_added: 'أُضيف المنتج الجديد بنجاح!',
                a_clearfilter: 'مسح المرشحات', a_tryother: 'جرّب كلمات أخرى أو امسح المرشحات أدناه.',
                a_stockdec: 'إنقاص 1', a_close: 'إغلاق', a_fail: 'فشل!',
                a_loading: 'جارٍ التحميل…', a_out: 'نفد', a_low: '{n} منخفض', a_ok: '{n} متوفر',
                a_banner: '{n} منتجات بمخزون ≤ {low} — أعد التعبئة قبل النفاد.',
            }
        }
    };

    var current = 'id';
    var page = 'store';

    function detectPage() {
        if (document.getElementById('adminLock') || document.getElementById('panel-produk')) return 'admin';
        return 'store';
    }

    function dict() { return DICT[page] || DICT.store; }

    function t(key, vars) {
        var d = dict();
        var s = (d[current] && d[current][key] != null) ? d[current][key]
              : (d.id && d.id[key] != null) ? d.id[key] : key;
        if (vars) {
            Object.keys(vars).forEach(function (k) {
                s = String(s).split('{' + k + '}').join(vars[k]);
            });
        }
        return s;
    }

    function applyTo(root) {
        var d = dict();
        var pack = d[current] || {};
        var fallback = d.id || {};
        function pick(key) {
            if (pack[key] != null) return pack[key];
            if (fallback[key] != null) return fallback[key];
            return null;
        }
        (root || document).querySelectorAll('[data-i18n]').forEach(function (el) {
            var v = pick(el.getAttribute('data-i18n'));
            if (v != null) el.innerHTML = v;
        });
        (root || document).querySelectorAll('[data-i18n-ph]').forEach(function (el) {
            var v = pick(el.getAttribute('data-i18n-ph'));
            if (v != null) el.setAttribute('placeholder', v);
        });
        (root || document).querySelectorAll('[data-i18n-aria]').forEach(function (el) {
            var v = pick(el.getAttribute('data-i18n-aria'));
            if (v != null) el.setAttribute('aria-label', v);
        });
        (root || document).querySelectorAll('[data-i18n-title]').forEach(function (el) {
            var v = pick(el.getAttribute('data-i18n-title'));
            if (v != null) el.setAttribute('title', v);
        });
        (root || document).querySelectorAll('[data-i18n-alt]').forEach(function (el) {
            var v = pick(el.getAttribute('data-i18n-alt'));
            if (v != null) el.setAttribute('alt', v);
        });
    }

    function paintSwitcher() {
        var btn = document.getElementById('langBtn');
        if (btn) {
            var label = btn.querySelector('.lang-code');
            if (label) label.textContent = LANGS[current].short;
            btn.setAttribute('aria-label', t('lang_aria') + ': ' + LANGS[current].label);
        }
        document.querySelectorAll('.lang-menu [data-lang]').forEach(function (b) {
            var on = b.getAttribute('data-lang') === current;
            b.classList.toggle('active', on);
            b.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        var cur = document.getElementById('langCurrent');
        if (cur) cur.textContent = LANGS[current].label;
    }

    function setLang(lang, save) {
        if (!LANGS[lang]) lang = 'id';
        current = lang;
        var meta = LANGS[lang];
        document.documentElement.lang = meta.html;
        document.documentElement.dir = meta.dir;
        if (save !== false) {
            try { localStorage.setItem('site-lang', lang); } catch (e) {}
        }
        applyTo(document);
        paintSwitcher();
        try { document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } })); } catch (e) {}
    }

    function mountSwitcher() {
        if (document.getElementById('langWrap')) return;
        var anchor = document.getElementById('themeToggle') || document.getElementById('adminLangSlot');
        if (!anchor || !anchor.parentElement) return;
        var wrap = document.createElement('div');
        wrap.className = 'lang-wrap';
        wrap.id = 'langWrap';
        wrap.innerHTML =
            '<button class="lang-btn" id="langBtn" type="button" aria-haspopup="true" aria-expanded="false">' +
                '<i class="bi bi-translate"></i><span class="lang-code">ID</span>' +
            '</button>' +
            '<div class="lang-menu" id="langMenu" role="menu">' +
                Object.keys(LANGS).map(function (code) {
                    return '<button type="button" role="menuitemradio" data-lang="' + code + '">' +
                        '<span class="lang-check"><i class="bi bi-check-lg"></i></span>' +
                        '<span>' + LANGS[code].label + '</span></button>';
                }).join('') +
            '</div>';
        anchor.parentElement.insertBefore(wrap, anchor);

        var btn = document.getElementById('langBtn');
        var menu = document.getElementById('langMenu');
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = menu.classList.toggle('open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) {
                menu.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
        menu.addEventListener('click', function (e) {
            var b = e.target.closest ? e.target.closest('[data-lang]') : null;
            if (!b) return;
            menu.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            setLang(b.getAttribute('data-lang'));
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                menu.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function init() {
        page = detectPage();
        var saved = null;
        try { saved = localStorage.getItem('site-lang'); } catch (e) {}
        if (!saved || !LANGS[saved]) saved = 'id';
        current = saved;
        mountSwitcher();
        setLang(saved, false);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.I18n = {
        t: t,
        set: setLang,
        get: function () { return current; },
        apply: applyTo,
        langs: LANGS
    };
})();
