/**
 * Navigasi utama situs, disusun mengikuti alur kerja peneliti
 * (Discover -> Learn -> Research -> Analyze -> Write -> Academy)
 * alih-alih daftar fitur. Header dan Footer sama-sama membaca dari
 * sini supaya keduanya tidak pernah berbeda struktur.
 *
 * `href: null` berarti tujuan itu belum punya halaman nyata. Item tetap
 * ditampilkan (menandakan peta jalan produk) tapi dirender non-klik,
 * bukan ditautkan ke route yang belum ada.
 */

export type NavLeaf = {
  label: string;
  href: string | null;
};

export type NavItem = NavLeaf & {
  children?: NavLeaf[];
};

export type FooterColumn = {
  title: string;
  links: NavLeaf[];
};

/** `base` adalah prefix locale, mis. "/id" atau "/en". */
export function getPrimaryNav(base: string): NavItem[] {
  return [
    {
      label: "Discover",
      href: null,
      children: [
        { label: "Research Search", href: null },
        { label: "Papers", href: null },
        { label: "Topics", href: null },
        { label: "Research Graph", href: null },
        { label: "Research Trends", href: null },
      ],
    },
    {
      label: "Learn",
      href: null,
      children: [
        { label: "Research Fundamentals", href: null },
        { label: "Research Methods", href: null },
        { label: "Quantitative Research", href: null },
        { label: "Qualitative Research", href: null },
        { label: "Mixed Methods", href: null },
        { label: "Statistics", href: null },
        { label: "Research Dictionary", href: null },
      ],
    },
    {
      label: "Research",
      href: null,
      children: [
        { label: "Research Planner", href: null },
        { label: "Research Design", href: null },
        { label: "Literature", href: null },
        { label: "Sampling", href: null },
        { label: "Instruments", href: null },
        { label: "Data Collection", href: null },
        { label: "My Projects", href: null },
      ],
    },
    {
      label: "Analyze",
      href: `${base}/tools`,
      children: [
        { label: "Analysis Advisor", href: null },
        { label: "Quantitative Analysis", href: null },
        { label: "Qualitative Analysis", href: null },
        { label: "Mixed Methods", href: null },
        { label: "Calculators", href: `${base}/tools` },
        { label: "Software Guides", href: null },
      ],
    },
    {
      label: "Write",
      href: null,
      children: [
        { label: "Proposal", href: null },
        { label: "Thesis", href: null },
        { label: "Dissertation", href: null },
        { label: "Journal Article", href: null },
        { label: "Academic Writing", href: null },
        { label: "Citation", href: `${base}/tools/citation` },
        { label: "Templates", href: null },
      ],
    },
    {
      label: "Academy",
      href: null,
      children: [
        { label: "Courses", href: null },
        { label: "Learning Paths", href: null },
        { label: "Tutorials", href: null },
        { label: "Workshops", href: null },
        { label: "Certificates", href: null },
      ],
    },
  ];
}

/**
 * Menu akun "My Research". Hanya dirender ketika `isAuthenticated`
 * bernilai true — saat ini tidak ada halaman yang mengirim nilai itu
 * karena situs belum punya mekanisme autentikasi nyata, jadi cabang ini
 * adalah sambungan siap pakai untuk nanti, bukan status yang ditebak.
 */
export function getMyResearchNav(): NavItem {
  return {
    label: "My Research",
    href: null,
    children: [
      { label: "Dashboard", href: null },
      { label: "Projects", href: null },
      { label: "Library", href: null },
      { label: "Documents", href: null },
      { label: "Datasets", href: null },
      { label: "Analyses", href: null },
      { label: "AI Conversations", href: null },
      { label: "Integrations", href: null },
      { label: "Account", href: null },
    ],
  };
}

export function getFooterColumns(base: string): FooterColumn[] {
  return [
    {
      title: "Product",
      links: [
        { label: "Discover", href: null },
        { label: "Research", href: null },
        { label: "Analyze", href: `${base}/tools` },
        { label: "Write", href: null },
        { label: "Copilot", href: null },
        { label: "My Research", href: null },
        { label: "Integrations", href: null },
      ],
    },
    {
      title: "Learn",
      links: [
        { label: "Research Methods", href: null },
        { label: "Quantitative Research", href: null },
        { label: "Qualitative Research", href: null },
        { label: "Mixed Methods", href: null },
        { label: "Statistics", href: null },
        { label: "Academic Writing", href: null },
        { label: "Research Dictionary", href: null },
        { label: "Academy", href: null },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Research Tools", href: `${base}/tools` },
        { label: "Calculators", href: `${base}/tools` },
        { label: "Templates", href: null },
        { label: "Datasets", href: null },
        { label: "Software Guides", href: null },
        { label: "Citation Guides", href: `${base}/tools/citation` },
        { label: "Research Examples", href: null },
        { label: "Help Center", href: null },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: null },
        { label: "Contact", href: null },
        { label: "Careers", href: null },
        { label: "Partnerships", href: null },
        { label: "Institutions", href: null },
        { label: "Contributors", href: null },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: null },
        { label: "Privacy Policy", href: null },
        { label: "Cookie Policy", href: null },
        { label: "Academic Integrity", href: null },
        { label: "AI Policy", href: null },
        { label: "Accessibility", href: null },
      ],
    },
  ];
}
