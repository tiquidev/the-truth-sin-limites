import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Movie } from '@/constants/mockContent';
import { POSTER_DIMENSIONS } from '@/constants/mockContent';

interface PosterCardProps {
  movie: Movie;
  onPress?: () => void;
}

export function PosterCard({ movie, onPress }: PosterCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <View style={styles.poster}>
        <Image
          source={{ uri: movie.posterUrl }}
          style={styles.image}
          contentFit="cover"
        />
      </View>
    </Pressable>
  );
}

const { width, height } = POSTER_DIMENSIONS;
const GAP = 8;

const styles = StyleSheet.create({
  wrapper: {
    marginRight: GAP,
  },
  pressed: {
    opacity: 0.85,
  },
  poster: {
    width,
    height,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  image: {
    width,
    height,
  },
});
