-- =====================================================================
-- MetodePenelitian.com — seed data (categories + sample articles)
-- Run AFTER schema.sql. Idempotent via ON CONFLICT.
-- =====================================================================

insert into categories (slug, name_id, name_en, sort_order) values
  ('methodology',      'Metodologi',          'Methodology',        1),
  ('statistics',       'Statistik',           'Statistics',         2),
  ('academic-writing', 'Penulisan Akademik',  'Academic Writing',   3),
  ('publication',      'Publikasi Jurnal',    'Journal Publication',4)
on conflict (slug) do nothing;

insert into tags (slug, name) values
  ('kualitatif', 'kualitatif'),
  ('kuantitatif', 'kuantitatif'),
  ('sampel', 'sampel'),
  ('validitas', 'validitas'),
  ('reliabilitas', 'reliabilitas'),
  ('sitasi', 'sitasi'),
  ('scopus', 'scopus')
on conflict (slug) do nothing;

insert into articles (slug, category_id, title_id, title_en, excerpt_id, excerpt_en, reading_minutes, difficulty, published_at)
values
  (
    'memahami-penelitian-kualitatif-vs-kuantitatif',
    (select id from categories where slug = 'methodology'),
    'Memahami Penelitian Kualitatif vs Kuantitatif',
    'Understanding Qualitative vs Quantitative Research',
    'Perbedaan mendasar, kapan menggunakan masing-masing pendekatan, dan cara memilih metode yang tepat.',
    'The core differences, when to use each approach, and how to choose the right method.',
    7, 'beginner', now()
  ),
  (
    'menentukan-ukuran-sampel-penelitian',
    (select id from categories where slug = 'methodology'),
    'Cara Menentukan Ukuran Sampel Penelitian',
    'How to Determine Your Research Sample Size',
    'Panduan praktis rumus Slovin dan Cochran serta margin of error.',
    'A practical guide to Slovin and Cochran formulas and margin of error.',
    6, 'beginner', now()
  ),
  (
    'uji-validitas-dan-reliabilitas',
    (select id from categories where slug = 'statistics'),
    'Uji Validitas dan Reliabilitas Instrumen',
    'Validity and Reliability of Instruments',
    'Validitas konstruk, korelasi item-total, dan Cronbach''s Alpha.',
    'Construct validity, item-total correlation, and Cronbach''s Alpha.',
    8, 'intermediate', now()
  )
on conflict (slug) do nothing;

insert into repository_items (slug, title, kind, description, is_premium) values
  ('template-proposal-skripsi', 'Template Proposal Skripsi', 'proposal', 'Kerangka proposal skripsi lengkap (Bab 1-3).', false),
  ('template-tesis-s2',         'Template Tesis S2',         'thesis',   'Struktur tesis magister sesuai kaidah akademik.', true),
  ('dataset-contoh-spss',       'Dataset Contoh SPSS',       'dataset',  'Dataset latihan untuk uji validitas & reliabilitas.', false)
on conflict (slug) do nothing;
