import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getMovieById } from '@/constants/mockContent';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const movie = id ? getMovieById(id) : undefined;

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
