/**
 * Datos mock para la UI estilo Netflix.
 * Las imágenes usan placeholders; luego puedes reemplazarlas por TMDB o tu API.
 */

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
}

export interface Category {
  id: string;
  name: string;
  items: Movie[];
}

// Poster size para carrusel estándar (ratio ~2:3)
const POSTER_WIDTH = 200;
const POSTER_HEIGHT = 300;

export const CATEGORIES: Category[] = [
  {
    id: 'trending',
    name: 'En tendencia',
    items: [
      { id: '1', title: 'Oppenheimer', posterUrl: 'https://picsum.photos/seed/opp/200/300' },
      { id: '2', title: 'Dune: Parte dos', posterUrl: 'https://picsum.photos/seed/dune/200/300' },
      { id: '3', title: 'Kung Fu Panda 4', posterUrl: 'https://picsum.photos/seed/kfp/200/300' },
      { id: '4', title: 'Gladiador II', posterUrl: 'https://picsum.photos/seed/glad/200/300' },
      { id: '5', title: 'Wicked', posterUrl: 'https://picsum.photos/seed/wick/200/300' },
      { id: '6', title: 'Moana 2', posterUrl: 'https://picsum.photos/seed/moana/200/300' },
    ],
  },
  {
    id: 'action',
    name: 'Acción',
    items: [
      { id: 'a1', title: 'Mad Max', posterUrl: 'https://picsum.photos/seed/a1/200/300' },
      { id: 'a2', title: 'John Wick', posterUrl: 'https://picsum.photos/seed/a2/200/300' },
      { id: 'a3', title: 'Misión Imposible', posterUrl: 'https://picsum.photos/seed/a3/200/300' },
      { id: 'a4', title: 'Fast & Furious', posterUrl: 'https://picsum.photos/seed/a4/200/300' },
      { id: 'a5', title: 'The Batman', posterUrl: 'https://picsum.photos/seed/a5/200/300' },
    ],
  },
  {
    id: 'comedy',
    name: 'Comedia',
    items: [
      { id: 'c1', title: 'Superbad', posterUrl: 'https://picsum.photos/seed/c1/200/300' },
      { id: 'c2', title: 'Los Bridgerton', posterUrl: 'https://picsum.photos/seed/c2/200/300' },
      { id: 'c3', title: 'Ted', posterUrl: 'https://picsum.photos/seed/c3/200/300' },
      { id: 'c4', title: 'Dumb and Dumber', posterUrl: 'https://picsum.photos/seed/c4/200/300' },
      { id: 'c5', title: 'The Hangover', posterUrl: 'https://picsum.photos/seed/c5/200/300' },
    ],
  },
  {
    id: 'drama',
    name: 'Drama',
    items: [
      { id: 'd1', title: 'The Shawshank Redemption', posterUrl: 'https://picsum.photos/seed/d1/200/300' },
      { id: 'd2', title: 'Forrest Gump', posterUrl: 'https://picsum.photos/seed/d2/200/300' },
      { id: 'd3', title: 'El Padrino', posterUrl: 'https://picsum.photos/seed/d3/200/300' },
      { id: 'd4', title: 'Schindler\'s List', posterUrl: 'https://picsum.photos/seed/d4/200/300' },
      { id: 'd5', title: 'Pulp Fiction', posterUrl: 'https://picsum.photos/seed/d5/200/300' },
    ],
  },
  {
    id: 'sci-fi',
    name: 'Ciencia ficción',
    items: [
      { id: 's1', title: 'Interstellar', posterUrl: 'https://picsum.photos/seed/s1/200/300' },
      { id: 's2', title: 'Blade Runner 2049', posterUrl: 'https://picsum.photos/seed/s2/200/300' },
      { id: 's3', title: 'The Matrix', posterUrl: 'https://picsum.photos/seed/s3/200/300' },
      { id: 's4', title: 'Arrival', posterUrl: 'https://picsum.photos/seed/s4/200/300' },
      { id: 's5', title: 'Ex Machina', posterUrl: 'https://picsum.photos/seed/s5/200/300' },
    ],
  },
];

export const POSTER_DIMENSIONS = { width: POSTER_WIDTH, height: POSTER_HEIGHT };
