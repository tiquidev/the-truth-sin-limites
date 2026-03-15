import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Episode } from '@/constants/mockContent';
import { getMovieById } from '@/constants/mockContent';

function EpisodeRow({
  episode,
  onPress,
  variant = 'video',
}: {
  episode: Episode;
  onPress: () => void;
  variant?: 'video' | 'audio';
}) {
  const isAudio = variant === 'audio';
  const label = isAudio ? `Pista ${episode.number}` : `Episodio ${episode.number}`;
  return (
    <Pressable
      style={({ pressed }) => [styles.episodeRow, pressed && styles.episodeRowPressed]}
      onPress={onPress}
    >
      <View style={[styles.episodeThumb, isAudio && styles.episodeThumbAudio]}>
        {episode.thumbnailUrl && !isAudio ? (
          <Image
            source={{ uri: episode.thumbnailUrl }}
            style={styles.episodeThumbImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.episodeThumbPlaceholder}>
            <Text style={styles.episodeThumbIcon}>{isAudio ? '🎧' : episode.number}</Text>
          </View>
        )}
        <View style={styles.episodePlayOverlay}>
          <Text style={styles.episodePlayIcon}>▶</Text>
        </View>
      </View>
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeNumber}>{label}</Text>
        <Text style={styles.episodeTitle} numberOfLines={2}>{episode.title}F</Text>
        <Text style={styles.episodeDuration}>{episode.duration}</Text>
      </View>
    </Pressable>
  );
}

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const movie = id ? getMovieById(id) : undefined;

  const handlePlayMovie = (title: string) => {
    Alert.alert('Reproducir', `¿Reproducir "${title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Reproducir', onPress: () => { } },
    ]);
  };

  const handlePlayEpisode = (showTitle: string, episode: Episode) => {
    Alert.alert(
      'Reproducir episodio',
      `${showTitle} - Ep. ${episode.number}: ${episode.title}`,
      [{ text: 'OK', onPress: () => { } }]
    );
  };

  const handlePlayAudio = () => {
    router.push({ pathname: '/audio-player', params: { id: movie!.id } });
  };

  if (!movie) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.errorText}>Contenido no encontrado</Text>
          <Text style={styles.backLink} onPress={() => router.back()}>
            Volver
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.closeButton} onPress={() => router.back()}>
            ✕
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.posterWrapper}>
            <Image
              source={{ uri: movie.posterUrl2 || movie.posterUrl }}
              style={styles.poster}
              contentFit="cover"
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.title}>{movie.title}</Text>

            {(movie.year || movie.rating || movie.duration || movie.genre) && (
              <View style={styles.meta}>
                {movie.year != null && (
                  <Text style={styles.metaItem}>{movie.year}</Text>
                )}
                {movie.rating && (
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{movie.rating}</Text>
                  </View>
                )}
                {movie.duration && (
                  <Text style={styles.metaItem}>{movie.duration}</Text>
                )}
                {movie.genre && (
                  <Text style={styles.metaItem}>{movie.genre}</Text>
                )}
              </View>
            )}

            {movie.description ? (
              <Text style={styles.description}>{movie.description}</Text>
            ) : null}

            {/* Serie: lista de episodios */}
            {movie.type === 'series' && movie.episodes && movie.episodes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Episodios</Text>
                <Text style={styles.sectionSubtitle}>
                  Temporada 1 · {movie.episodes.length} episodios
                </Text>
                {movie.episodes.map((episode) => (
                  <EpisodeRow
                    key={episode.id}
                    episode={episode}
                    variant="video"
                    onPress={() => handlePlayEpisode(movie.title, episode)}
                  />
                ))}
              </View>
            )}

            {/* Audio con varias pistas/episodios */}
            {movie.type === 'audio' && movie.episodes && movie.episodes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pistas</Text>
                <Text style={styles.sectionSubtitle}>
                  {movie.episodes.length} episodios
                </Text>
                {movie.episodes.map((episode) => (
                  <EpisodeRow
                    key={episode.id}
                    episode={episode}
                    variant="audio"
                    onPress={() => handlePlayAudio()}
                  />
                ))}
              </View>
            )}

            {/* Audio único: una sola pista para escuchar */}
            {movie.type === 'audio' && (!movie.episodes || movie.episodes.length === 0) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Escuchar</Text>
                <Pressable
                  style={({ pressed }) => [styles.playCard, pressed && styles.playCardPressed]}
                  onPress={() => handlePlayAudio()}
                >
                  <View style={styles.playCardLeft}>
                    <Text style={styles.playIcon}>▶</Text>
                    <View>
                      <Text style={styles.playCardTitle}>{movie.title}</Text>
                      <Text style={styles.playCardMeta}>
                        {[movie.duration, movie.year].filter(Boolean).join(' · ')}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.playCardAction}>Escuchar</Text>
                </Pressable>
              </View>
            )}

            {/* Película: opción para ver */}
            {(movie.type === 'movie' || movie.type === undefined) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ver</Text>
                <Pressable
                  style={({ pressed }) => [styles.playCard, pressed && styles.playCardPressed]}
                  onPress={() => handlePlayMovie(movie.title)}
                >
                  <View style={styles.playCardLeft}>
                    <Text style={styles.playIcon}>▶</Text>
                    <View>
                      <Text style={styles.playCardTitle}>{movie.title}</Text>
                      <Text style={styles.playCardMeta}>
                        {[movie.duration, movie.year].filter(Boolean).join(' · ')}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.playCardAction}>Reproducir</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  posterWrapper: {
    width: '100%',
    height: 420,
    // aspectRatio: 3 / 3,
    // maxHeight: 420,
    backgroundColor: '#2a2a2a',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  info: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  metaItem: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  ratingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#b3b3b3',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#e5e5e5',
  },
  section: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 16,
  },
  playCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
  },
  playCardPressed: {
    opacity: 0.9,
  },
  playCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  playIcon: {
    fontSize: 24,
    color: '#fff',
  },
  playCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  playCardMeta: {
    fontSize: 13,
    color: '#b3b3b3',
    marginTop: 2,
  },
  playCardAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e50914',
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  episodeRowPressed: {
    opacity: 0.8,
  },
  episodeThumb: {
    width: 160,
    height: 90,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  episodeThumbImage: {
    width: '100%',
    height: '100%',
  },
  episodeThumbPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeThumbNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#666',
  },
  episodeThumbIcon: {
    fontSize: 32,
  },
  episodeThumbAudio: {
    backgroundColor: '#1a1a2e',
  },
  episodePlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  episodePlayIcon: {
    fontSize: 28,
    color: '#fff',
  },
  episodeInfo: {
    flex: 1,
    marginLeft: 14,
  },
  episodeNumber: {
    fontSize: 12,
    color: '#808080',
    marginBottom: 2,
  },
  episodeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  episodeDuration: {
    fontSize: 13,
    color: '#b3b3b3',
    marginTop: 4,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },
  backLink: {
    fontSize: 16,
    color: '#e50914',
    textAlign: 'center',
    marginTop: 16,
  },
});
