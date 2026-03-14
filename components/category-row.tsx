import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Category } from '@/constants/mockContent';
import { PosterCard } from '@/components/poster-card';

interface CategoryRowProps {
  category: Category;
  onMoviePress?: (movieId: string) => void;
}

export function CategoryRow({ category, onMoviePress }: CategoryRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category.name}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {category.items.map((movie) => (
          <PosterCard
            key={movie.id}
            movie={movie}
            onPress={() => onMoviePress?.(movie.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingRight: 24,
  },
});
