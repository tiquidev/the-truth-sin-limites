import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryRow } from '@/components/category-row';
import { CATEGORIES } from '@/constants/mockContent';

export default function HomeScreen() {
  const handleMoviePress = (movieId: string) => {
    // TODO: navegar a detalle o abrir modal
    console.log('Película seleccionada:', movieId);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.logo}>THE TRUTH</Text>
         {/* <View style={styles.headerRight}>
            <Text style={styles.headerIcon}>🔍</Text>
            <Text style={styles.headerIcon}>👤</Text>
          </View>*/}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {CATEGORIES.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onMoviePress={handleMoviePress}
            />
          ))}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#141414',
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#e50914',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 20,
  },
  headerIcon: {
    fontSize: 22,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
});
