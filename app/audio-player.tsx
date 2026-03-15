import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AudioPlayer from '@/components/AudioPlayer';
import type { AudioTrack } from '@/components/AudioPlayer';
import { getMovieById } from '@/constants/mockContent';

export default function AudioPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const movie = id ? getMovieById(id) : undefined;

  if (!movie || movie.type !== 'audio') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.centered}>
          <Text style={styles.errorText}>Audio no encontrado</Text>
          <Text style={styles.backLink} onPress={() => router.back()}>
            Volver
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  // Build tracks from movie data
  const tracks: AudioTrack[] =
    movie.episodes && movie.episodes.length > 0
      ? movie.episodes.map((ep) => ({
          id: ep.id,
          title: ep.title,
          artist: movie.title,
          chapter: `Pista ${ep.number}`,
          // Usamos el slug del poster del movie como thumbnail por defecto
          thumbnailSlug: movie.id,
          audioSlug: ep.id,
        }))
      : [
          {
            id: movie.id,
            title: movie.title,
            artist: 'The Truth Sin Límites',
            thumbnailSlug: movie.id,
            audioSlug: movie.id,
          },
        ];

  const handleProgressSave = (trackId: string, position: number) => {
    console.log(`Progreso guardado: track=${trackId}, position=${position.toFixed(1)}s`);
    // TODO: Persistir en AsyncStorage o backend
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.closeButton} onPress={() => router.back()}>
            ✕
          </Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {movie.title}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AudioPlayer
            tracks={tracks}
            onProgressSave={handleProgressSave}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
    padding: 4,
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  backLink: {
    color: '#C9A227',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});
