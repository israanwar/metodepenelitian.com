type LogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

/**
 * Mark MetodePenelitian.com: aset logo asli milik pengguna
 * (public/logo.png — "Quiet Breakthrough"). Dipakai apa adanya, tanpa
 * crop, recolor, atau komposisi ulang.
 *
 * Sengaja pakai <img> biasa, BUKAN next/image: pipeline optimisasi
 * bawaan Next butuh `sharp` (tidak terpasang di project ini) dan
 * fallback internalnya gagal diam-diam, menghasilkan response kosong
 * yang membuat logo tampak sebagai kotak hitam solid. <img> langsung
 * menyajikan file dari public/ tanpa diproses ulang, jadi transparansi
 * PNG aslinya utuh.
 */
export function Logo({ size = 36, className = "", title }: LogoProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/logo.png"
      alt={title ?? ""}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
