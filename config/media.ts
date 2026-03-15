// Cambiar este valor cuando configuren el dominio público de R2
// export const R2_BASE_URL = 'https://media.thetruthsinlimites.app';
export const R2_BASE_URL = 'https://pub-6d39dca9bf3a4524a31bebdd991b8b02.r2.dev';

// Calidades de video disponibles (para Fase 2)
export const VIDEO_QUALITIES = ['480p', '720p', '1080p'] as const;
export type VideoQuality = (typeof VIDEO_QUALITIES)[number];
