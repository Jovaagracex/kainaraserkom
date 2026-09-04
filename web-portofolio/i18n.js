/* ============================================================
 * I18n — Portofolio Erlangga (web-portofolio)
 * - Kamus: portfolio (index.html), 4 bahasa (id default).
 * - Cara pakai di HTML: data-i18n="kunci" (isi/teks),
 *   data-i18n-ph="kunci" (placeholder), data-i18n-aria="kunci",
 *   data-i18n-title="kunci", data-i18n-alt="kunci" (alt gambar).
 * - Di JS: I18n.t('kunci').
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
        id: {
            nav_tentang: 'Tentang', nav_layanan: 'Layanan', nav_keahlian: 'Keahlian',
            nav_proyek: 'Proyek', nav_kontak: 'Kontak', lang_aria: 'Pilih bahasa',
            loader_shop: 'Membuka toko...',
            hero_tag: 'Junior Web Developer — Serkom 2026',
            hero_title: 'Halo, saya<br><em>Erlangga.</em>',
            hero_sub: 'Saya ngoprek web sejak 2024, mulai dari HTML polos sampai akhirnya bisa bikin toko online beneran pakai Supabase. Masih junior dan masih banyak belajar — tapi setiap proyek di bawah ini saya kerjakan sendiri sampai jalan.',
            hero_shop: 'Lihat Toko Saya', hero_story: 'Cerita Saya',
            stat1: 'Proyek Selesai', stat2: 'Teknologi', stat3: 'Serkom Junior',
            photo_note: 'ini saya, waktu begadang ngerjain katalog ->',
            badge_t: 'Web Developer', badge_s: 'Junior Level',
            photo_alt: 'Foto Profil Erlangga',
            ab_eyebrow: 'Tentang Saya', ab_title: 'Sedikit cerita,<br>bukan sekadar CV.',
            ab_note: 'saya nulis bagian ini sendiri, janji.', ab_cta: 'Hubungi Saya',
            ab_p1: 'Awalnya saya cuma iseng edit template blog pakai HTML. Ternyata keterusan — sekarang saya bisa bangun web dari nol: potong desain jadi HTML/CSS, bikin interaksi pakai JavaScript, sampai simpan data beneran lewat <strong>Supabase</strong>.',
            ab_p2: 'Saya paling nyaman di <em>frontend</em>, tapi nggak alergi backend. Kalau ada error, saya baca dokumentasinya dulu sebelum nanya — kebiasaan yang (katanya) bagus buat developer.',
            ab_mastered: 'Yang sudah saya kuasai',
            learn_t: 'Sedang saya pelajari',
            learn_d: 'React dan Tailwind — baru sampai tutorial, belum berani dipakai di proyek klien. Target tahun ini bisa satu proyek pakai React.',
            jr_eyebrow: 'Perjalanan', jr_title: 'Gimana saya sampai sini',
            y1t: 'Mulai dari nol — HTML & CSS', y1d: 'Belajar otodidak dari dokumentasi dan video gratis. Proyek pertama: web profil statis buat tugas, jelek tapi jalan. Dari situ ketagihan.',
            y2t: 'JavaScript & Bootstrap', y2d: 'Mulai paham DOM, fetch API, dan bikin layout responsif tanpa pusing. Sempat stuck 2 minggu cuma gara-gara async/await — wajar, katanya.',
            y3t: 'Supabase & sertifikasi', y3d: 'Bangun Kainara Studio: katalog dinamis, keranjang, sampai panel admin CRUD. Proyek ini yang saya ajukan untuk sertifikasi Junior Web Developer.',
            ly_eyebrow: 'Layanan', ly_title: 'Kalau mau dibikinin web, saya bisa yang ini',
            ly_sub: 'Skala kecil-menengah. Saya kerjakan sendiri, jadi komunikasinya langsung — nggak lewat admin.',
            s1t: 'Web Profil & Company', s1d: 'Buat personal branding, CV online, atau profil usaha. Satu halaman rapi yang enak dibuka di HP.',
            s1l1: 'Desain responsif mobile-first', s1l2: 'Form kontak + tombol WhatsApp', s1l3: 'Contoh: web ini sendiri',
            s2t: 'Toko Online + Panel Admin', s2d: 'Katalog produk yang bisa diupdate sendiri tanpa ngoding, lengkap dengan keranjang & order via WhatsApp.',
            s2l1: 'CRUD produk + upload gambar', s2l2: 'Keranjang & checkout WhatsApp', s2l3: 'Contoh: Kainara Studio',
            s3t: 'CRUD & Database', s3d: 'Butuh simpan data beneran? Saya pasang Supabase: tabel, API, sampai aturan akses datanya.',
            s3l1: 'PostgreSQL + REST API', s3l2: 'Validasi & sanitasi input', s3l3: 'Laporan sederhana per tabel',
            sk_eyebrow: 'Keahlian', sk_title: 'Yang saya pakai tiap hari',
            sk_sub: 'Belum semuanya expert — tapi semuanya pernah saya pakai di proyek beneran, bukan cuma tutorial.',
            sk1d: 'Struktur semantik,<br>aksesibilitas & SEO', sk2d: 'Flexbox, Grid,<br>Custom Properties',
            sk3d: 'ES Modules, Async/Await,<br>DOM Manipulation', sk4d: 'Responsive layouts,<br>Komponen UI',
            sk5d: 'PostgreSQL, Auth,<br>Storage, REST API', sk6d: 'Version Control,<br>GitHub Workflow',
            sk7d: 'Mobile-first,<br>Multi-device', sk8d: 'RLS, Input Validation,<br>Sanitisasi Data',
            pj_eyebrow: 'Proyek Unggulan', pj_title: 'Karya Nyata dari Kode',
            pj_sub: 'Setiap proyek adalah tantangan yang mengasah kemampuan saya membangun solusi nyata.',
            feat_eyebrow: 'Proyek Utama — Uji Serkom',
            feat_title: 'Kainara Studio<br><em>— Toko Batik Online</em>',
            feat_d: 'Aplikasi e-commerce full-stack untuk toko batik lokal. Menampilkan katalog produk dinamis dari Supabase, Panel Admin CRUD lengkap dengan upload gambar ke Supabase Storage, dan UI yang estetis & responsif.',
            feat_btn: 'Kunjungi Usaha Saya: Kainara Studio', feat_preview: 'Lihat Cuplikan',
            feat_alt: 'Kainara Studio — Toko Batik Online',
            p1_tag: 'HTML / CSS', p1_t: 'Web Portofolio Pribadi',
            p1_d: 'Website profil pribadi yang responsif dan estetis untuk memperkenalkan diri sebagai Junior Web Developer kepada dunia.',
            p1_link: 'Lihat Detail', p1_alt: 'Portofolio Web',
            p2_tag: 'JavaScript', p2_t: 'Admin Dashboard CRUD',
            p2_d: 'Panel manajemen produk dengan operasi Create, Read, Update, Delete terintegrasi dengan Supabase secara real-time.',
            p2_link: 'Lihat Admin Panel', p2_alt: 'CRUD Admin Dashboard',
            ct_eyebrow: 'Kontak', ct_title: 'Mari Berkolaborasi',
            ct_sub: 'Tertarik bekerja sama atau sekadar ingin bertukar pikiran? Kirim pesan dan saya akan membalas segera.',
            ok_t: 'Makasih, pesannya masuk!',
            ok_d: 'Saya balas maks 2x24 jam. Kalau penting, chat WhatsApp saja biar cepat.',
            f_name: 'Nama Lengkap', f_name_ph: 'Nama Anda',
            f_email: 'Email', f_subject: 'Subjek', f_subject_ph: 'Perihal pesan Anda',
            f_msg: 'Pesan', f_msg_ph: 'Tulis pesan Anda di sini...', f_send: 'Kirim Pesan',
            err_name: 'Isi nama minimal 3 huruf ya.', err_email: 'Emailnya kayaknya typo — cek lagi.',
            err_subject: 'Subjeknya jangan kosong.', err_msg: 'Ceritain sedikit lebih panjang (min 10 karakter).',
            sending: 'Mengirim...',
            md_title: 'Cuplikan Kainara Studio',
            cap1: 'Halaman utama + katalog produk', cap2: 'Keranjang & checkout via WhatsApp', cap3: 'Panel admin CRUD produk',
            li1: 'Katalog dinamis dari Supabase + pencarian & filter',
            li2: 'Keranjang belanja + checkout via WhatsApp',
            li3: 'Panel admin CRUD terkunci PIN + dark mode',
            car1_alt: 'Halaman utama toko', car2_alt: 'Keranjang dan checkout', car3_alt: 'Panel admin',
            ft_copy: '© 2026 Erlangga — dibangun manual pakai HTML, CSS, JS. Tanpa template.',
            top_title: 'Kembali ke Atas'
        },
        en: {
            nav_tentang: 'About', nav_layanan: 'Services', nav_keahlian: 'Skills',
            nav_proyek: 'Projects', nav_kontak: 'Contact', lang_aria: 'Choose language',
            loader_shop: 'Opening the store...',
            hero_tag: 'Junior Web Developer — Cert. 2026',
            hero_title: 'Hi, I’m<br><em>Erlangga.</em>',
            hero_sub: 'I’ve been tinkering with the web since 2024, from plain HTML to actually building a real online store with Supabase. Still junior and still learning a lot — but every project below I built myself until it worked.',
            hero_shop: 'See My Store', hero_story: 'My Story',
            stat1: 'Projects Done', stat2: 'Technologies', stat3: 'Junior Cert.',
            photo_note: 'that’s me, pulling an all-nighter on the catalog ->',
            badge_t: 'Web Developer', badge_s: 'Junior Level',
            photo_alt: 'Erlangga’s Profile Photo',
            ab_eyebrow: 'About Me', ab_title: 'A short story,<br>not just a CV.',
            ab_note: 'I wrote this part myself, promise.', ab_cta: 'Contact Me',
            ab_p1: 'It started with me idly editing a blog template in HTML. Then it stuck — now I can build a web from scratch: slicing designs into HTML/CSS, adding interaction with JavaScript, even storing real data via <strong>Supabase</strong>.',
            ab_p2: 'I’m most comfortable in <em>frontend</em>, but not allergic to backend. When there’s an error, I read the docs first before asking — a habit that’s (supposedly) good for developers.',
            ab_mastered: 'What I’ve mastered',
            learn_t: 'Currently learning',
            learn_d: 'React and Tailwind — still at tutorial stage, not brave enough for client projects yet. This year’s goal: one project in React.',
            jr_eyebrow: 'Journey', jr_title: 'How I got here',
            y1t: 'Starting from zero — HTML & CSS', y1d: 'Self-taught from docs and free videos. First project: a static profile page for homework, ugly but working. Got hooked from there.',
            y2t: 'JavaScript & Bootstrap', y2d: 'Started getting DOM, fetch API, and responsive layouts without headaches. Got stuck 2 weeks on async/await alone — normal, they say.',
            y3t: 'Supabase & certification', y3d: 'Built Kainara Studio: dynamic catalog, cart, up to a CRUD admin panel. This is the project I submitted for Junior Web Developer certification.',
            ly_eyebrow: 'Services', ly_title: 'If you want a website, here’s what I can do',
            ly_sub: 'Small to medium scale. I work alone, so communication is direct — no middleman.',
            s1t: 'Profile & Company Web', s1d: 'For personal branding, online CV, or business profile. One neat page that’s nice to open on phones.',
            s1l1: 'Mobile-first responsive design', s1l2: 'Contact form + WhatsApp button', s1l3: 'Example: this very site',
            s2t: 'Online Store + Admin Panel', s2d: 'A product catalog you can update yourself without coding, complete with cart & WhatsApp ordering.',
            s2l1: 'Product CRUD + image upload', s2l2: 'Cart & WhatsApp checkout', s2l3: 'Example: Kainara Studio',
            s3t: 'CRUD & Database', s3d: 'Need to store real data? I’ll set up Supabase: tables, API, even the data access rules.',
            s3l1: 'PostgreSQL + REST API', s3l2: 'Input validation & sanitization', s3l3: 'Simple reports per table',
            sk_eyebrow: 'Skills', sk_title: 'What I use every day',
            sk_sub: 'Not all expert yet — but all used in real projects, not just tutorials.',
            sk1d: 'Semantic structure,<br>accessibility & SEO', sk2d: 'Flexbox, Grid,<br>Custom Properties',
            sk3d: 'ES Modules, Async/Await,<br>DOM Manipulation', sk4d: 'Responsive layouts,<br>UI Components',
            sk5d: 'PostgreSQL, Auth,<br>Storage, REST API', sk6d: 'Version Control,<br>GitHub Workflow',
            sk7d: 'Mobile-first,<br>Multi-device', sk8d: 'RLS, Input Validation,<br>Data Sanitization',
            pj_eyebrow: 'Featured Projects', pj_title: 'Real Work from Code',
            pj_sub: 'Each project is a challenge that sharpened my ability to build real solutions.',
            feat_eyebrow: 'Main Project — Cert. Test',
            feat_title: 'Kainara Studio<br><em>— Online Batik Store</em>',
            feat_d: 'A full-stack e-commerce app for a local batik store. Featuring a dynamic product catalog from Supabase, a complete CRUD Admin Panel with image upload to Supabase Storage, and an aesthetic & responsive UI.',
            feat_btn: 'Visit My Business: Kainara Studio', feat_preview: 'See Preview',
            feat_alt: 'Kainara Studio — Online Batik Store',
            p1_tag: 'HTML / CSS', p1_t: 'Personal Portfolio Web',
            p1_d: 'A responsive and aesthetic personal profile website to introduce myself to the world as a Junior Web Developer.',
            p1_link: 'See Details', p1_alt: 'Portfolio Web',
            p2_tag: 'JavaScript', p2_t: 'CRUD Admin Dashboard',
            p2_d: 'A product management panel with Create, Read, Update, Delete operations integrated with Supabase in real-time.',
            p2_link: 'See Admin Panel', p2_alt: 'CRUD Admin Dashboard',
            ct_eyebrow: 'Contact', ct_title: 'Let’s Collaborate',
            ct_sub: 'Interested in working together or just want to exchange ideas? Send a message and I’ll reply soon.',
            ok_t: 'Thanks, message received!',
            ok_d: 'I’ll reply within 2x24 hours max. If urgent, just chat on WhatsApp for speed.',
            f_name: 'Full Name', f_name_ph: 'Your Name',
            f_email: 'Email', f_subject: 'Subject', f_subject_ph: 'Subject of your message',
            f_msg: 'Message', f_msg_ph: 'Write your message here...', f_send: 'Send Message',
            err_name: 'Please enter at least 3 letters for the name.', err_email: 'The email looks mistyped — check again.',
            err_subject: 'Don’t leave the subject empty.', err_msg: 'Tell a bit more (min 10 characters).',
            sending: 'Sending...',
            md_title: 'Kainara Studio Preview',
            cap1: 'Homepage + product catalog', cap2: 'Cart & checkout via WhatsApp', cap3: 'Product CRUD admin panel',
            li1: 'Dynamic catalog from Supabase + search & filters',
            li2: 'Shopping cart + checkout via WhatsApp',
            li3: 'PIN-locked CRUD admin panel + dark mode',
            car1_alt: 'Store homepage', car2_alt: 'Cart and checkout', car3_alt: 'Admin panel',
            ft_copy: '© 2026 Erlangga — hand-built with HTML, CSS, JS. No template.',
            top_title: 'Back to Top'
        },
        ja: {
            nav_tentang: '紹介', nav_layanan: 'サービス', nav_keahlian: 'スキル',
            nav_proyek: '作品', nav_kontak: '連絡', lang_aria: '言語を選ぶ',
            loader_shop: '店舗を開いています...',
            hero_tag: 'ジュニアWeb開発者 — 2026認定',
            hero_title: 'こんにちは、<br><em>エルランガ</em>です。',
            hero_sub: '2024年からWebをいじり始め、素のHTMLからSupabaseを使った本物のネットショップまで作れるようになりました。まだジュニアで学ぶことも多いですが、下の作品はすべて自分で動くまで作り上げました。',
            hero_shop: '私の店を見る', hero_story: '私の物語',
            stat1: '完成作品', stat2: '技術', stat3: 'ジュニア認定',
            photo_note: 'カタログ作りで徹夜したときの私 ->',
            badge_t: 'Web開発者', badge_s: 'ジュニアレベル',
            photo_alt: 'エルランガのプロフィール写真',
            ab_eyebrow: '自己紹介', ab_title: 'ちょっとした物語、<br>履歴書だけじゃない。',
            ab_note: 'ここは自分で書きました、約束。', ab_cta: '連絡する',
            ab_p1: '始まりはブログのテンプレートをHTMLでいじる暇つぶしでした。ハマってしまい — 今ではゼロからWebを作れます：デザインをHTML/CSSに起こし、JavaScriptで動きを付け、<strong>Supabase</strong>で実データを保存するところまで。',
            ab_p2: '一番得意なのは<em>フロントエンド</em>ですが、バックエンドも嫌いじゃありません。エラーが出たら聞く前にまずドキュメントを読む — 開発者として（たぶん）良い習慣です。',
            ab_mastered: '習得済みの技術',
            learn_t: '学習中',
            learn_d: 'ReactとTailwind — まだチュートリアル段階で、案件で使う勇気はありません。今年の目標はReactで1作品。',
            jr_eyebrow: '歩み', jr_title: 'ここまでの道のり',
            y1t: 'ゼロから — HTML & CSS', y1d: 'ドキュメントと無料動画で独学。最初の作品は課題用の静的プロフィールページ、ダサいけど動いた。そこからハマりました。',
            y2t: 'JavaScript & Bootstrap', y2d: 'DOM、fetch API、レスポンシブレイアウトが苦なく作れるように。async/awaitだけで2週間詰まったことも — よくある話だそうです。',
            y3t: 'Supabase & 認定', y3d: 'カイナラ・スタジオを構築：動的カタログ、カート、CRUD管理パネルまで。この作品をジュニアWeb開発者認定に提出しました。',
            ly_eyebrow: 'サービス', ly_title: 'Webを作ってほしいなら、できるのはこれ',
            ly_sub: '小〜中規模。自分一人でやるので、やり取りは直接 — 仲介なしです。',
            s1t: 'プロフィール＆会社サイト', s1d: '個人ブランディング、オンライン履歴書、店舗紹介に。スマホで見やすい1ページをきれいに。',
            s1l1: 'モバイルファーストのレスポンシブ', s1l2: '問い合わせフォーム＋WhatsAppボタン', s1l3: '例：このサイト自体',
            s2t: 'ネットショップ＋管理パネル', s2d: 'コードを書かずに自分で更新できる商品カタログ。カート＆WhatsApp注文付き。',
            s2l1: '商品CRUD＋画像アップロード', s2l2: 'カート＆WhatsApp決済', s2l3: '例：カイナラ・スタジオ',
            s3t: 'CRUD＆データベース', s3d: '実データを保存したい？Supabaseを導入します：テーブル、API、アクセスルールまで。',
            s3l1: 'PostgreSQL＋REST API', s3l2: '入力検証＆無害化', s3l3: 'テーブルごとの簡易レポート',
            sk_eyebrow: 'スキル', sk_title: '毎日使う技術',
            sk_sub: '全部がエキスパートではありません — でも全部、チュートリアルではなく実案件で使いました。',
            sk1d: 'セマンティック構造、<br>アクセシビリティ＆SEO', sk2d: 'Flexbox、Grid、<br>カスタムプロパティ',
            sk3d: 'ESモジュール、Async/Await、<br>DOM操作', sk4d: 'レスポンシブレイアウト、<br>UIコンポーネント',
            sk5d: 'PostgreSQL、認証、<br>ストレージ、REST API', sk6d: 'バージョン管理、<br>GitHubワークフロー',
            sk7d: 'モバイルファースト、<br>マルチデバイス', sk8d: 'RLS、入力検証、<br>データ無害化',
            pj_eyebrow: '代表作', pj_title: 'コードから生まれた実作',
            pj_sub: 'どの作品も、実用的なものを作る力を磨いた挑戦です。',
            feat_eyebrow: 'メイン作品 — 認定試験',
            feat_title: 'カイナラ・スタジオ<br><em>— オンラインバティック店</em>',
            feat_d: '地元のバティック店向けフルスタックECアプリ。Supabaseからの動的商品カタログ、画像アップロード付きCRUD管理パネル、美しくレスポンシブなUIを搭載。',
            feat_btn: '私の店を見る：カイナラ・スタジオ', feat_preview: 'プレビューを見る',
            feat_alt: 'カイナラ・スタジオ — オンラインバティック店',
            p1_tag: 'HTML / CSS', p1_t: '個人ポートフォリオサイト',
            p1_d: 'ジュニアWeb開発者として世界に自己紹介するための、レスポンシブで美しい個人プロフィールサイト。',
            p1_link: '詳細を見る', p1_alt: 'ポートフォリオサイト',
            p2_tag: 'JavaScript', p2_t: 'CRUD管理ダッシュボード',
            p2_d: 'Supabaseとリアルタイム連携した作成・読取・更新・削除機能付き商品管理パネル。',
            p2_link: '管理パネルを見る', p2_alt: 'CRUD管理ダッシュボード',
            ct_eyebrow: '連絡', ct_title: '一緒に作りましょう',
            ct_sub: '一緒に仕事しませんか？アイデア交換だけでも大歓迎です。メッセージを送ってください、すぐ返信します。',
            ok_t: 'ありがとう、メッセージ届きました！',
            ok_d: '最大48時間以内に返信します。急ぎならWhatsAppでどうぞ。',
            f_name: '氏名', f_name_ph: 'お名前',
            f_email: 'メール', f_subject: '件名', f_subject_ph: 'メッセージの件名',
            f_msg: 'メッセージ', f_msg_ph: 'メッセージをここに書く...', f_send: 'メッセージを送信',
            err_name: '名前は3文字以上で入力してください。', err_email: 'メールが間違っているようです — 確認してください。',
            err_subject: '件名を空にしないでください。', err_msg: 'もう少し詳しく書いてください（10文字以上）。',
            sending: '送信中...',
            md_title: 'カイナラ・スタジオのプレビュー',
            cap1: 'トップページ＋商品カタログ', cap2: 'カート＆WhatsApp決済', cap3: '商品CRUD管理パネル',
            li1: 'Supabaseからの動的カタログ＋検索＆絞り込み',
            li2: 'ショッピングカート＋WhatsApp決済',
            li3: 'PINロック付きCRUD管理パネル＋ダークモード',
            car1_alt: '店舗のトップページ', car2_alt: 'カートと決済', car3_alt: '管理パネル',
            ft_copy: '© 2026 エルランガ — HTML、CSS、JSで手作り。テンプレート不使用。',
            top_title: 'トップに戻る'
        },
        ar: {
            nav_tentang: 'من أنا', nav_layanan: 'خدماتي', nav_keahlian: 'مهاراتي',
            nav_proyek: 'أعمالي', nav_kontak: 'تواصل', lang_aria: 'اختر اللغة',
            loader_shop: 'جارٍ فتح المتجر...',
            hero_tag: 'مطور ويب مبتدئ — شهادة 2026',
            hero_title: 'مرحبًا، أنا<br><em>إرلانغا.</em>',
            hero_sub: 'أعبث بالويب منذ 2024، من HTML بسيط حتى صرت أبني متجرًا إلكترونيًا حقيقيًا بـ Supabase. ما زلت مبتدئًا وأتعلم الكثير — لكن كل مشروع أدناه بنيته بنفسي حتى اشتغل.',
            hero_shop: 'شاهد متجري', hero_story: 'قصتي',
            stat1: 'مشاريع منجزة', stat2: 'تقنيات', stat3: 'شهادة مبتدئ',
            photo_note: 'هذا أنا، ساهرًا أشتغل على الكتالوج ->',
            badge_t: 'مطور ويب', badge_s: 'مستوى مبتدئ',
            photo_alt: 'الصورة الشخصية لإرلانغا',
            ab_eyebrow: 'من أنا', ab_title: 'قصة قصيرة،<br>ليست مجرد سيرة ذاتية.',
            ab_note: 'كتبت هذا الجزء بنفسي، وعد.', ab_cta: 'تواصل معي',
            ab_p1: 'بدأت بتعديل قالب مدونة بـ HTML من باب التسلية. ثم أدمنت — والآن أبني الويب من الصفر: تقطيع التصميم إلى HTML/CSS وإضافة التفاعل بـ JavaScript وحتى تخزين بيانات حقيقية عبر <strong>Supabase</strong>.',
            ab_p2: 'أرتاح أكثر في <em>الواجهات</em> لكن لا حساسية لدي من الخلفية. عند الخطأ أقرأ التوثيق أولًا قبل السؤال — عادة (يُقال إنها) جيدة للمطور.',
            ab_mastered: 'ما أتقنته',
            learn_t: 'أتعلمه حاليًا',
            learn_d: 'React وTailwind — ما زلت في مرحلة الدروس ولم أجرؤ على استخدامهما لعملاء بعد. هدف هذا العام: مشروع واحد بـ React.',
            jr_eyebrow: 'الرحلة', jr_title: 'كيف وصلت إلى هنا',
            y1t: 'البداية من الصفر — HTML وCSS', y1d: 'تعلم ذاتي من التوثيق وفيديوهات مجانية. أول مشروع: صفحة شخصية ثابتة لواجب، قبيحة لكنها تعمل. ومن هناك أدمنت.',
            y2t: 'JavaScript وBootstrap', y2d: 'بدأت أفهم DOM وواجهة fetch وأبني تخطيطات متجاوبة بدون صداع. علقت أسبوعين بسبب async/await وحدها — عادي كما يُقال.',
            y3t: 'Supabase والشهادة', y3d: 'بنيت كاينارا ستوديو: كتالوج ديناميكي وسلة حتى لوحة إدارة CRUD. هذا المشروع قدمته لشهادة مطور الويب المبتدئ.',
            ly_eyebrow: 'خدماتي', ly_title: 'إن أردت موقعًا، هذا ما أستطيع فعله',
            ly_sub: 'نطاق صغير إلى متوسط. أعمل وحدي فالتواصل مباشر — بدون وسيط.',
            s1t: 'مواقع شخصية وشركات', s1d: 'للعلامة الشخصية أو السيرة أونلاين أو ملف شركة. صفحة واحدة أنيقة مريحة على الجوال.',
            s1l1: 'تصميم متجاوب يبدأ بالجوال', s1l2: 'نموذج تواصل + زر واتساب', s1l3: 'مثال: هذا الموقع نفسه',
            s2t: 'متجر إلكتروني + لوحة إدارة', s2d: 'كتالوج منتجات تحدّثه بنفسك بدون برمجة، مع سلة وطلب عبر واتساب.',
            s2l1: 'CRUD منتجات + رفع صور', s2l2: 'سلة ودفع واتساب', s2l3: 'مثال: كاينارا ستوديو',
            s3t: 'CRUD وقواعد بيانات', s3d: 'تحتاج تخزين بيانات حقيقية؟ أركّب Supabase: جداول وواجهات وحتى قواعد الوصول.',
            s3l1: 'PostgreSQL + REST API', s3l2: 'تحقق من المدخلات وتعقيمها', s3l3: 'تقارير بسيطة لكل جدول',
            sk_eyebrow: 'مهاراتي', sk_title: 'ما أستخدمه كل يوم',
            sk_sub: 'ليست كلها بمستوى خبير — لكنها كلها استُخدمت في مشاريع حقيقية لا دروس فقط.',
            sk1d: 'بنية دلالية،<br>وصولية وSEO', sk2d: 'Flexbox وGrid<br>وخصائص مخصصة',
            sk3d: 'وحدات ES وAsync/Await<br>والتعامل مع DOM', sk4d: 'تخطيطات متجاوبة<br>ومكونات واجهة',
            sk5d: 'PostgreSQL ومصادقة<br>وتخزين وREST API', sk6d: 'تحكم بالإصدارات<br>وسير GitHub',
            sk7d: 'يبدأ بالجوال<br>ومتعدد الأجهزة', sk8d: 'RLS وتحقق مدخلات<br>وتعقيم بيانات',
            pj_eyebrow: 'أعمال مختارة', pj_title: 'أعمال حقيقية من الكود',
            pj_sub: 'كل مشروع تحدٍّ صقل قدرتي على بناء حلول حقيقية.',
            feat_eyebrow: 'المشروع الرئيسي — اختبار الشهادة',
            feat_title: 'كاينارا ستوديو<br><em>— متجر باتيك إلكتروني</em>',
            feat_d: 'تطبيق تجارة إلكترونية متكامل لمتجر باتيك محلي. يعرض كتالوج منتجات ديناميكيًا من Supabase ولوحة إدارة CRUD كاملة مع رفع الصور إلى تخزين Supabase وواجهة أنيقة ومتجاوبة.',
            feat_btn: 'زر عملي: كاينارا ستوديو', feat_preview: 'شاهد المعاينة',
            feat_alt: 'كاينارا ستوديو — متجر باتيك إلكتروني',
            p1_tag: 'HTML / CSS', p1_t: 'موقع شخصي',
            p1_d: 'موقع ملف شخصي متجاوب وأنيق لأعرّف بنفسي للعالم كمطور ويب مبتدئ.',
            p1_link: 'شاهد التفاصيل', p1_alt: 'موقع الأعمال',
            p2_tag: 'JavaScript', p2_t: 'لوحة إدارة CRUD',
            p2_d: 'لوحة إدارة منتجات بعمليات الإنشاء والقراءة والتحديث والحذف متكاملة مع Supabase لحظيًا.',
            p2_link: 'شاهد لوحة الإدارة', p2_alt: 'لوحة إدارة CRUD',
            ct_eyebrow: 'تواصل', ct_title: 'لنتعاون',
            ct_sub: 'مهتم بالعمل معًا أو تريد تبادل الأفكار؟ أرسل رسالة وسأرد قريبًا.',
            ok_t: 'شكرًا، وصلت الرسالة!',
            ok_d: 'سأرد خلال 48 ساعة كحد أقصى. وإن كان مهمًا فراسلني واتساب أسرع.',
            f_name: 'الاسم الكامل', f_name_ph: 'اسمك',
            f_email: 'البريد', f_subject: 'الموضوع', f_subject_ph: 'موضوع رسالتك',
            f_msg: 'الرسالة', f_msg_ph: 'اكتب رسالتك هنا...', f_send: 'إرسال الرسالة',
            err_name: 'اكتب الاسم 3 أحرف على الأقل.', err_email: 'يبدو البريد مكتوبًا خطأ — تحقق مجددًا.',
            err_subject: 'لا تترك الموضوع فارغًا.', err_msg: 'احكِ بتفصيل أكثر قليلًا (10 أحرف على الأقل).',
            sending: 'جارٍ الإرسال...',
            md_title: 'معاينة كاينارا ستوديو',
            cap1: 'الصفحة الرئيسية + كتالوج المنتجات', cap2: 'السلة والدفع عبر واتساب', cap3: 'لوحة إدارة CRUD للمنتجات',
            li1: 'كتالوج ديناميكي من Supabase + بحث ومرشحات',
            li2: 'سلة تسوق + دفع عبر واتساب',
            li3: 'لوحة إدارة CRUD مقفلة برمز + وضع ليلي',
            car1_alt: 'الصفحة الرئيسية للمتجر', car2_alt: 'السلة والدفع', car3_alt: 'لوحة الإدارة',
            ft_copy: '© 2026 إرلانغا — بُني يدويًا بـ HTML وCSS وJS. بدون قالب.',
            top_title: 'عودة للأعلى'
        }
    };

    var current = 'id';

    function t(key, vars) {
        var s = (DICT[current] && DICT[current][key] != null) ? DICT[current][key]
              : (DICT.id[key] != null) ? DICT.id[key] : key;
        if (vars) {
            Object.keys(vars).forEach(function (k) {
                s = String(s).split('{' + k + '}').join(vars[k]);
            });
        }
        return s;
    }

    function applyTo(root) {
        var pack = DICT[current] || {};
        function pick(key) {
            if (pack[key] != null) return pack[key];
            if (DICT.id[key] != null) return DICT.id[key];
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
        var anchor = document.getElementById('themeToggle');
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
