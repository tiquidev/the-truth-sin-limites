/**
 * Datos mock para la UI estilo Netflix.
 * Las imágenes usan placeholders; luego puedes reemplazarlas por TMDB o tu API.
 */

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  thumbnailUrl?: string;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  posterUrl2?: string;
  description?: string;
  year?: number;
  rating?: string;
  duration?: string;
  genre?: string;
  /** 'movie' = película, 'series' = serie con episodios, 'audio' = solo audio (podcast, audiobook, etc.) */
  type?: 'movie' | 'series' | 'audio';
  episodes?: Episode[];
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
      { id: '1', title: 'Oppenheimer', posterUrl: 'https://zlzkdmctyfxmshpgjeft.supabase.co/storage/v1/object/public/assets/portada.png', posterUrl2: 'https://zlzkdmctyfxmshpgjeft.supabase.co/storage/v1/object/public/assets/portada-3.jpeg', description: 'La historia del físico J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica durante la Segunda Guerra Mundial.', year: 2023, rating: 'R', duration: '3h 0min', genre: 'Drama, Historia' },
      { id: '2', title: 'Dune: Parte dos', posterUrl: 'https://picsum.photos/seed/dune/200/300', description: 'Paul Atreides se une a los Fremen y se embarca en un viaje de venganza mientras intenta evitar un futuro terrible que solo él puede prever.', year: 2024, rating: 'PG-13', duration: '2h 46min', genre: 'Ciencia ficción, Aventura' },
      { id: '3', title: 'Kung Fu Panda 4', posterUrl: 'https://picsum.photos/seed/kfp/200/300', description: 'Po debe entrenar a un nuevo guerrero cuando es elegido para convertirse en el líder espiritual del Valle de la Paz.', year: 2024, rating: 'PG', duration: '1h 34min', genre: 'Animación, Comedia, Acción' },
      { id: '4', title: 'Gladiador II', posterUrl: 'https://picsum.photos/seed/glad/200/300', description: 'Años después de presenciar la muerte de sus padres, Lucius es forzado a entrar en el Coliseo para sobrevivir.', year: 2024, rating: 'R', duration: '2h 38min', genre: 'Acción, Drama, Épica' },
      { id: '5', title: 'Wicked', posterUrl: 'https://picsum.photos/seed/wick/200/300', description: 'La historia de Elphaba, la Bruja Mala del Oeste, y su relación con Glinda antes de que llegara Dorothy.', year: 2024, rating: 'PG-13', duration: '2h 42min', genre: 'Musical, Fantasía' },
      { id: '6', title: 'Moana 2', posterUrl: 'https://picsum.photos/seed/moana/200/300', description: 'Moana emprende un viaje por el océano junto a un grupo de navegantes inesperados después de recibir una llamada de sus ancestros.', year: 2024, rating: 'PG', duration: '1h 47min', genre: 'Animación, Aventura, Musical' },
    ],
  },
  {
    id: 'action',
    name: 'Acción',
    items: [
      { id: 'a1', title: 'Mad Max', posterUrl: 'https://picsum.photos/seed/a1/200/300', description: 'En un mundo postapocalíptico, Max se une a un grupo que huye a través del desierto en un war rig.', year: 2015, rating: 'R', duration: '2h 0min', genre: 'Acción, Ciencia ficción' },
      { id: 'a2', title: 'John Wick', posterUrl: 'https://picsum.photos/seed/a2/200/300', description: 'Un exasesino vuelve a la acción cuando unos mafiosos roban su coche y matan a su perro.', year: 2014, rating: 'R', duration: '1h 41min', genre: 'Acción, Thriller' },
      { id: 'a3', title: 'Misión Imposible', posterUrl: 'https://picsum.photos/seed/a3/200/300', description: 'Ethan Hunt y el IMF deben localizar una arma terrorista antes de que caiga en manos equivocadas.', year: 2023, rating: 'PG-13', duration: '2h 43min', genre: 'Acción, Espionaje' },
      { id: 'a4', title: 'Fast & Furious', posterUrl: 'https://picsum.photos/seed/a4/200/300', description: 'Dominic Toretto y su familia se enfrentan al villano más letal que jamás hayan conocido.', year: 2023, rating: 'PG-13', duration: '2h 21min', genre: 'Acción, Crimen' },
      { id: 'a5', title: 'The Batman', posterUrl: 'https://picsum.photos/seed/a5/200/300', description: 'Batman debe desenmascarar al Enigma mientras recorre los bajos fondos de Gotham.', year: 2022, rating: 'PG-13', duration: '2h 56min', genre: 'Acción, Crimen, Thriller' },
    ],
  },
  {
    id: 'comedy',
    name: 'Comedia',
    items: [
      { id: 'c1', title: 'Superbad', posterUrl: 'https://picsum.photos/seed/c1/200/300', description: 'Dos amigos de secundaria intentan conseguir alcohol para una fiesta para impresionar a sus crush.', year: 2007, rating: 'R', duration: '1h 53min', genre: 'Comedia' },
      {
        id: 'c2',
        title: 'Los Bridgerton',
        posterUrl: 'https://picsum.photos/seed/c2/200/300',
        description: 'La alta sociedad londinense navega el escándalo y el romance en la temporada social.',
        year: 2020,
        rating: 'TV-MA',
        duration: 'Serie',
        genre: 'Drama, Romance',
        type: 'series',
        episodes: [
          { id: 'c2-e1', number: 1, title: 'Diamond of the First Water', duration: '57 min', thumbnailUrl: 'https://picsum.photos/seed/c2e1/320/180' },
          { id: 'c2-e2', number: 2, title: 'Shock and Delight', duration: '58 min', thumbnailUrl: 'https://picsum.photos/seed/c2e2/320/180' },
          { id: 'c2-e3', number: 3, title: 'Art of the Swoon', duration: '56 min', thumbnailUrl: 'https://picsum.photos/seed/c2e3/320/180' },
          { id: 'c2-e4', number: 4, title: 'An Affair of Honor', duration: '59 min', thumbnailUrl: 'https://picsum.photos/seed/c2e4/320/180' },
          { id: 'c2-e5', number: 5, title: 'The Duke and I', duration: '57 min', thumbnailUrl: 'https://picsum.photos/seed/c2e5/320/180' },
          { id: 'c2-e6', number: 6, title: 'Swish', duration: '55 min', thumbnailUrl: 'https://picsum.photos/seed/c2e6/320/180' },
          { id: 'c2-e7', number: 7, title: 'Oceans Apart', duration: '58 min', thumbnailUrl: 'https://picsum.photos/seed/c2e7/320/180' },
          { id: 'c2-e8', number: 8, title: 'After the Rain', duration: '60 min', thumbnailUrl: 'https://picsum.photos/seed/c2e8/320/180' },
        ],
      },
      { id: 'c3', title: 'Ted', posterUrl: 'https://picsum.photos/seed/c3/200/300', description: 'John Bennett debe elegir entre quedarse con su oso de peluche parlante Ted o madurar con su novia.', year: 2012, rating: 'R', duration: '1h 46min', genre: 'Comedia, Fantasía' },
      { id: 'c4', title: 'Dumb and Dumber', posterUrl: 'https://picsum.photos/seed/c4/200/300', description: 'Dos amigos tontos emprenden un viaje para devolver un maletín lleno de dinero.', year: 1994, rating: 'PG-13', duration: '1h 47min', genre: 'Comedia' },
      { id: 'c5', title: 'The Hangover', posterUrl: 'https://picsum.photos/seed/c5/200/300', description: 'Tres amigos despiertan en Las Vegas sin el novio y sin memoria de la noche anterior.', year: 2009, rating: 'R', duration: '1h 40min', genre: 'Comedia' },
    ],
  },
  {
    id: 'drama',
    name: 'Drama',
    items: [
      { id: 'd1', title: 'The Shawshank Redemption', posterUrl: 'https://picsum.photos/seed/d1/200/300', description: 'Un banquero condenado por asesinato encuentra redención en la prisión de Shawshank.', year: 1994, rating: 'R', duration: '2h 22min', genre: 'Drama' },
      { id: 'd2', title: 'Forrest Gump', posterUrl: 'https://picsum.photos/seed/d2/200/300', description: 'Forrest Gump narra su extraordinaria vida mientras influye en algunos de los eventos clave de la historia de EE.UU.', year: 1994, rating: 'PG-13', duration: '2h 22min', genre: 'Drama, Romance' },
      { id: 'd3', title: 'El Padrino', posterUrl: 'https://picsum.photos/seed/d3/200/300', description: 'El patriarca de una dinastía criminal traspasa el control de su imperio a su hijo reacio.', year: 1972, rating: 'R', duration: '2h 55min', genre: 'Drama, Crimen' },
      { id: 'd4', title: 'Schindler\'s List', posterUrl: 'https://picsum.photos/seed/d4/200/300', description: 'Oskar Schindler salva a más de mil judíos durante el Holocausto empleándolos en su fábrica.', year: 1993, rating: 'R', duration: '3h 15min', genre: 'Drama, Historia' },
      { id: 'd5', title: 'Pulp Fiction', posterUrl: 'https://picsum.photos/seed/d5/200/300', description: 'Las vidas de dos mafiosos, un boxeador y una pareja se entrelazan en cuatro historias de violencia y redención.', year: 1994, rating: 'R', duration: '2h 34min', genre: 'Drama, Crimen' },
    ],
  },
  {
    id: 'sci-fi',
    name: 'Ciencia ficción',
    items: [
      { id: 's1', title: 'Interstellar', posterUrl: 'https://picsum.photos/seed/s1/200/300', description: 'Un grupo de exploradores viaja a través de un agujero de gusano en el espacio en busca de un nuevo hogar.', year: 2014, rating: 'PG-13', duration: '2h 49min', genre: 'Ciencia ficción, Drama' },
      { id: 's2', title: 'Blade Runner 2049', posterUrl: 'https://picsum.photos/seed/s2/200/300', description: 'Un blade runner descubre un secreto que podría sumir a la sociedad en el caos.', year: 2017, rating: 'R', duration: '2h 44min', genre: 'Ciencia ficción, Thriller' },
      { id: 's3', title: 'The Matrix', posterUrl: 'https://picsum.photos/seed/s3/200/300', description: 'Un hacker descubre que la realidad es una simulación y es elegido para liberar a la humanidad.', year: 1999, rating: 'R', duration: '2h 16min', genre: 'Ciencia ficción, Acción' },
      { id: 's4', title: 'Arrival', posterUrl: 'https://picsum.photos/seed/s4/200/300', description: 'Una lingüista es reclutada para comunicarse con alienígenas que han llegado a la Tierra.', year: 2016, rating: 'PG-13', duration: '1h 56min', genre: 'Ciencia ficción, Drama' },
      { id: 's5', title: 'Ex Machina', posterUrl: 'https://picsum.photos/seed/s5/200/300', description: 'Un programador es invitado a evaluar la conciencia de un humanoide con IA en la mansión de un CEO.', year: 2014, rating: 'R', duration: '1h 48min', genre: 'Ciencia ficción, Thriller' },
    ],
  },
  {
    id: 'audio',
    name: 'Audio',
    items: [
      {
        id: 'au1',
        title: 'Meditación guiada: 10 min',
        posterUrl: 'https://picsum.photos/seed/au1/200/300',
        description: 'Sesión de respiración y relajación para terminar el día. Ideal para conciliar el sueño.',
        duration: '10 min',
        genre: 'Bienestar',
        type: 'audio',
      },
      {
        id: 'au2',
        title: 'The Truth Sin Límites',
        posterUrl: 'https://picsum.photos/seed/au2/200/300',
        description: 'Podcast sobre historias reales y reflexiones sin filtro. Nuevos episodios cada semana.',
        year: 2024,
        duration: 'Podcast',
        genre: 'Conversación, Reflexión',
        type: 'audio',
        episodes: [
          { id: 'au2-e1', number: 1, title: 'Introducción: ¿Qué es la verdad?', duration: '42 min' },
          { id: 'au2-e2', number: 2, title: 'Límites que nos imponemos', duration: '38 min' },
          { id: 'au2-e3', number: 3, title: 'Historias que nos definen', duration: '51 min' },
          { id: 'au2-e4', number: 4, title: 'El poder de escuchar', duration: '45 min' },
          { id: 'au2-e5', number: 5, title: 'Sin límites', duration: '48 min' },
        ],
      },
    ],
  },
];

/** Busca una película por id en todas las categorías */
export function getMovieById(id: string): Movie | undefined {
  for (const category of CATEGORIES) {
    const movie = category.items.find((m) => m.id === id);
    if (movie) return movie;
  }
  return undefined;
}

export const POSTER_DIMENSIONS = { width: POSTER_WIDTH, height: POSTER_HEIGHT };
