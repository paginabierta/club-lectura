// Avatares predefinidos (iconos planos, en el estilo visual del sitio).
// No se generan imágenes reales: son 3 siluetas simples para que cada
// miembro elija la que prefiera.

export const AVATARES = {
  neutral: {
    nombre: "Libro",
    svg: `<circle cx="20" cy="20" r="19" fill="var(--moss)"/>
      <path d="M11 15 C14.5 13.5 17.5 13.5 20 15 C22.5 13.5 25.5 13.5 29 15 L29 25 C25.5 23.5 22.5 23.5 20 25 C17.5 23.5 14.5 23.5 11 25 Z" fill="none" stroke="#F1ECE0" stroke-width="1.4" stroke-linejoin="round"/>
      <line x1="20" y1="15" x2="20" y2="25" stroke="#F1ECE0" stroke-width="1.4"/>`
  },
  perfil_a: {
    nombre: "Silueta A",
    svg: `<circle cx="20" cy="20" r="19" fill="var(--pencil)"/>
      <circle cx="20" cy="16" r="6" fill="#F1ECE0"/>
      <path d="M8 32 C8 24 13 21 20 21 C27 21 32 24 32 32 Z" fill="#F1ECE0"/>`
  },
  perfil_b: {
    nombre: "Silueta B",
    svg: `<circle cx="20" cy="20" r="19" fill="var(--ink)"/>
      <path d="M13 15 C13 10.5 16 8 20 8 C24 8 27 10.5 27 15 C27 15 28 15 28 17 C28 19 26.5 19.5 26 18.5 C25 21 22.7 22.5 20 22.5 C17.3 22.5 15 21 14 18.5 C13.5 19.5 12 19 12 17 C12 15 13 15 13 15 Z" fill="#F1ECE0"/>
      <path d="M7 33 C7 25 12.5 22 20 22 C27.5 22 33 25 33 33 Z" fill="#F1ECE0"/>`
  },
};

/** Devuelve el markup SVG completo (con círculo de fondo) para un tipo de avatar. */
export function avatarSVG(tipo, tamano = 40) {
  const a = AVATARES[tipo] || AVATARES.neutral;
  return `<svg width="${tamano}" height="${tamano}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">${a.svg}</svg>`;
}
