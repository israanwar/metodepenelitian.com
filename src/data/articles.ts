import type { Locale } from "@/i18n/config";

export type ArticleCategory =
  | "methodology"
  | "statistics"
  | "academic-writing"
  | "publication";

export interface LocalizedText {
  id: string;
  en: string;
}

export interface Article {
  slug: string;
  category: ArticleCategory;
  title: LocalizedText;
  excerpt: LocalizedText;
  /** HTML body per locale (rendered with the .prose-academic styles). */
  body: LocalizedText;
  author: string;
  updatedAt: string; // ISO date
  readingMinutes: number;
  tags: string[];
}

export const categoryLabels: Record<ArticleCategory, LocalizedText> = {
  methodology: { id: "Metodologi", en: "Methodology" },
  statistics: { id: "Statistik", en: "Statistics" },
  "academic-writing": { id: "Penulisan Akademik", en: "Academic Writing" },
  publication: { id: "Publikasi Jurnal", en: "Journal Publication" },
};

export function localize(text: LocalizedText, lang: Locale): string {
  return text[lang] ?? text.id;
}

export const articles: Article[] = [
  {
    slug: "memahami-penelitian-kualitatif-vs-kuantitatif",
    category: "methodology",
    title: {
      id: "Memahami Penelitian Kualitatif vs Kuantitatif",
      en: "Understanding Qualitative vs Quantitative Research",
    },
    excerpt: {
      id: "Perbedaan mendasar, kapan menggunakan masing-masing pendekatan, dan cara memilih metode yang tepat untuk pertanyaan penelitian Anda.",
      en: "The core differences, when to use each approach, and how to choose the right method for your research question.",
    },
    body: {
      id: `<h2>Pendahuluan</h2><p>Dua paradigma utama dalam penelitian adalah pendekatan <strong>kualitatif</strong> dan <strong>kuantitatif</strong>. Memilih pendekatan yang tepat sangat menentukan validitas hasil penelitian Anda.</p><h2>Penelitian Kuantitatif</h2><p>Penelitian kuantitatif berfokus pada pengukuran numerik dan analisis statistik. Cocok ketika Anda ingin menguji hipotesis, mengukur hubungan antar-variabel, atau menggeneralisasi temuan ke populasi yang lebih luas.</p><ul><li>Data berupa angka</li><li>Menggunakan instrumen terstruktur (kuesioner, tes)</li><li>Analisis dengan statistik deskriptif dan inferensial</li></ul><h2>Penelitian Kualitatif</h2><p>Penelitian kualitatif berfokus pada pemahaman mendalam terhadap fenomena. Cocok untuk mengeksplorasi makna, pengalaman, dan konteks.</p><ul><li>Data berupa teks, gambar, atau narasi</li><li>Menggunakan wawancara, observasi, FGD</li><li>Analisis tematik atau grounded theory</li></ul><h2>Kapan Memilih?</h2><p>Gunakan <code>kuantitatif</code> untuk pertanyaan "seberapa banyak" atau "apakah ada pengaruh", dan <code>kualitatif</code> untuk pertanyaan "mengapa" atau "bagaimana".</p>`,
      en: `<h2>Introduction</h2><p>The two major research paradigms are the <strong>qualitative</strong> and <strong>quantitative</strong> approaches. Choosing the right one strongly determines the validity of your findings.</p><h2>Quantitative Research</h2><p>Quantitative research focuses on numerical measurement and statistical analysis. It fits when you want to test hypotheses, measure relationships between variables, or generalize findings to a broader population.</p><ul><li>Numeric data</li><li>Structured instruments (questionnaires, tests)</li><li>Descriptive and inferential statistics</li></ul><h2>Qualitative Research</h2><p>Qualitative research focuses on a deep understanding of a phenomenon. It suits exploring meaning, experience, and context.</p><ul><li>Text, image, or narrative data</li><li>Interviews, observation, focus groups</li><li>Thematic analysis or grounded theory</li></ul><h2>When to Choose?</h2><p>Use <code>quantitative</code> for "how much" or "is there an effect" questions, and <code>qualitative</code> for "why" or "how" questions.</p>`,
    },
    author: "Tim MetodePenelitian",
    updatedAt: "2026-05-12",
    readingMinutes: 7,
    tags: ["kualitatif", "kuantitatif", "paradigma", "desain penelitian"],
  },
  {
    slug: "menentukan-ukuran-sampel-penelitian",
    category: "methodology",
    title: {
      id: "Cara Menentukan Ukuran Sampel Penelitian",
      en: "How to Determine Your Research Sample Size",
    },
    excerpt: {
      id: "Panduan praktis menggunakan rumus Slovin dan Cochran, serta pertimbangan margin of error dan tingkat kepercayaan.",
      en: "A practical guide to Slovin and Cochran formulas, plus margin of error and confidence level considerations.",
    },
    body: {
      id: `<h2>Mengapa Ukuran Sampel Penting?</h2><p>Ukuran sampel yang terlalu kecil menurunkan kekuatan statistik, sementara yang terlalu besar memboroskan sumber daya. Tujuannya adalah menemukan jumlah minimum yang representatif.</p><h2>Rumus Slovin</h2><p>Untuk populasi yang diketahui, rumus Slovin sederhana dan populer: <code>n = N / (1 + N·e²)</code>, dengan <code>N</code> ukuran populasi dan <code>e</code> margin of error.</p><h2>Rumus Cochran</h2><p>Untuk populasi besar atau tidak diketahui, gunakan rumus Cochran yang memperhitungkan proporsi dan nilai Z.</p><p>Coba langsung di <strong>Research Tools → Kalkulator Ukuran Sampel</strong>.</p>`,
      en: `<h2>Why Sample Size Matters</h2><p>A sample that's too small reduces statistical power, while one that's too large wastes resources. The goal is the minimum representative number.</p><h2>Slovin's Formula</h2><p>For a known population, Slovin's formula is simple and popular: <code>n = N / (1 + N·e²)</code>, where <code>N</code> is population size and <code>e</code> is the margin of error.</p><h2>Cochran's Formula</h2><p>For large or unknown populations, use Cochran's formula, which accounts for proportion and the Z value.</p><p>Try it directly in <strong>Research Tools → Sample Size Calculator</strong>.</p>`,
    },
    author: "Dr. Andi Statistika",
    updatedAt: "2026-06-01",
    readingMinutes: 6,
    tags: ["sampel", "slovin", "cochran", "populasi"],
  },
  {
    slug: "uji-validitas-dan-reliabilitas",
    category: "statistics",
    title: {
      id: "Uji Validitas dan Reliabilitas Instrumen",
      en: "Validity and Reliability of Instruments",
    },
    excerpt: {
      id: "Memahami validitas konstruk, korelasi item-total, dan Cronbach's Alpha untuk memastikan kualitas kuesioner Anda.",
      en: "Understand construct validity, item-total correlation, and Cronbach's Alpha to ensure your questionnaire quality.",
    },
    body: {
      id: `<h2>Validitas</h2><p>Validitas mengukur sejauh mana instrumen mengukur apa yang seharusnya diukur. Uji yang umum adalah korelasi item-total (Pearson), di mana item dinyatakan valid jika r-hitung > r-tabel.</p><h2>Reliabilitas</h2><p>Reliabilitas mengukur konsistensi instrumen. <strong>Cronbach's Alpha</strong> adalah indikator paling umum:</p><ul><li>α ≥ 0.9 — Sangat baik</li><li>0.8 ≤ α < 0.9 — Baik</li><li>0.7 ≤ α < 0.8 — Dapat diterima</li><li>α < 0.7 — Perlu diperbaiki</li></ul><p>Hitung Alpha instrumen Anda di <strong>Research Tools → Kalkulator Cronbach's Alpha</strong>.</p>`,
      en: `<h2>Validity</h2><p>Validity measures how well an instrument measures what it should. A common test is item-total correlation (Pearson), where an item is valid if computed r > table r.</p><h2>Reliability</h2><p>Reliability measures instrument consistency. <strong>Cronbach's Alpha</strong> is the most common indicator:</p><ul><li>α ≥ 0.9 — Excellent</li><li>0.8 ≤ α < 0.9 — Good</li><li>0.7 ≤ α < 0.8 — Acceptable</li><li>α < 0.7 — Needs revision</li></ul><p>Compute your instrument's Alpha in <strong>Research Tools → Cronbach's Alpha Calculator</strong>.</p>`,
    },
    author: "Dr. Andi Statistika",
    updatedAt: "2026-06-18",
    readingMinutes: 8,
    tags: ["validitas", "reliabilitas", "cronbach", "kuesioner"],
  },
  {
    slug: "menyusun-literatur-review-sistematis",
    category: "academic-writing",
    title: {
      id: "Menyusun Literature Review yang Sistematis",
      en: "Writing a Systematic Literature Review",
    },
    excerpt: {
      id: "Langkah-langkah menyusun tinjauan pustaka yang kuat, dari pencarian basis data hingga sintesis tema.",
      en: "Steps to build a strong literature review, from database searching to thematic synthesis.",
    },
    body: {
      id: `<h2>Tujuan Literature Review</h2><p>Tinjauan pustaka memetakan apa yang sudah diketahui, mengidentifikasi <em>research gap</em>, dan memposisikan kontribusi Anda.</p><h2>Langkah Praktis</h2><ol><li>Tentukan pertanyaan dan kata kunci</li><li>Cari di Scopus, Web of Science, Google Scholar</li><li>Saring berdasarkan kriteria inklusi/eksklusi</li><li>Ekstraksi data ke tabel sintesis</li><li>Kelompokkan ke dalam tema</li></ol><h2>Tips</h2><p>Gunakan diagram PRISMA untuk transparansi proses seleksi artikel.</p>`,
      en: `<h2>Purpose of a Literature Review</h2><p>A literature review maps what is already known, identifies the <em>research gap</em>, and positions your contribution.</p><h2>Practical Steps</h2><ol><li>Define your question and keywords</li><li>Search Scopus, Web of Science, Google Scholar</li><li>Filter by inclusion/exclusion criteria</li><li>Extract data into a synthesis table</li><li>Group into themes</li></ol><h2>Tips</h2><p>Use a PRISMA diagram to make your article selection process transparent.</p>`,
    },
    author: "Prof. Sari Akademia",
    updatedAt: "2026-04-22",
    readingMinutes: 9,
    tags: ["literature review", "prisma", "research gap", "sintesis"],
  },
  {
    slug: "menghindari-plagiarisme-dan-sitasi",
    category: "academic-writing",
    title: {
      id: "Menghindari Plagiarisme dan Sitasi yang Benar",
      en: "Avoiding Plagiarism and Citing Correctly",
    },
    excerpt: {
      id: "Jenis plagiarisme, cara parafrase yang baik, dan format sitasi APA, MLA, serta Chicago.",
      en: "Types of plagiarism, good paraphrasing, and APA, MLA, and Chicago citation formats.",
    },
    body: {
      id: `<h2>Apa itu Plagiarisme?</h2><p>Plagiarisme adalah menggunakan karya atau ide orang lain tanpa atribusi yang layak. Bentuknya beragam: verbatim, parafrase tanpa sitasi, hingga self-plagiarism.</p><h2>Parafrase yang Baik</h2><p>Parafrase bukan sekadar mengganti kata dengan sinonim — Anda harus benar-benar memahami dan menuliskan ulang dengan struktur baru, lalu tetap mencantumkan sumber.</p><h2>Format Sitasi</h2><p>Gunakan gaya yang konsisten (APA, MLA, atau Chicago). Buat sitasi otomatis di <strong>Research Tools → Generator Sitasi</strong>.</p>`,
      en: `<h2>What is Plagiarism?</h2><p>Plagiarism is using someone else's work or ideas without proper attribution. It ranges from verbatim copying and uncited paraphrase to self-plagiarism.</p><h2>Good Paraphrasing</h2><p>Paraphrasing is not just swapping words for synonyms — you must truly understand and rewrite with a new structure, then still cite the source.</p><h2>Citation Formats</h2><p>Use a consistent style (APA, MLA, or Chicago). Generate citations automatically in <strong>Research Tools → Citation Generator</strong>.</p>`,
    },
    author: "Prof. Sari Akademia",
    updatedAt: "2026-05-30",
    readingMinutes: 6,
    tags: ["plagiarisme", "sitasi", "apa", "parafrase"],
  },
  {
    slug: "strategi-publikasi-jurnal-terindeks-scopus",
    category: "publication",
    title: {
      id: "Strategi Publikasi di Jurnal Terindeks Scopus",
      en: "Strategies for Publishing in Scopus-Indexed Journals",
    },
    excerpt: {
      id: "Cara memilih jurnal target, memahami quartile, dan menghindari jurnal predator.",
      en: "How to choose a target journal, understand quartiles, and avoid predatory journals.",
    },
    body: {
      id: `<h2>Memilih Jurnal Target</h2><p>Cocokkan ruang lingkup (<em>aims & scope</em>) jurnal dengan topik Anda. Perhatikan quartile (Q1–Q4) dan CiteScore.</p><h2>Menghindari Jurnal Predator</h2><p>Waspadai janji publikasi cepat, biaya tidak transparan, dan proses review yang tidak jelas. Cek indeksasi di situs resmi Scopus.</p><h2>Proses Submission</h2><ol><li>Siapkan naskah sesuai template jurnal</li><li>Tulis cover letter yang meyakinkan</li><li>Respons reviewer secara profesional</li></ol>`,
      en: `<h2>Choosing a Target Journal</h2><p>Match the journal's aims & scope with your topic. Note the quartile (Q1–Q4) and CiteScore.</p><h2>Avoiding Predatory Journals</h2><p>Beware of promises of fast publication, opaque fees, and unclear review processes. Verify indexing on the official Scopus site.</p><h2>Submission Process</h2><ol><li>Prepare the manuscript per the journal template</li><li>Write a convincing cover letter</li><li>Respond to reviewers professionally</li></ol>`,
    },
    author: "Prof. Sari Akademia",
    updatedAt: "2026-07-05",
    readingMinutes: 8,
    tags: ["scopus", "publikasi", "quartile", "jurnal predator"],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function relatedArticles(article: Article, limit = 3): Article[] {
  return articles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .concat(articles.filter((a) => a.slug !== article.slug && a.category !== article.category))
    .slice(0, limit);
}
