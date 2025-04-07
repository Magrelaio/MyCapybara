import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const miniGames = [
  { id: '1', name: 'Candybara', screen: '/games/candybara' }, 
  { id: '2', name: 'Corrida Maluca', screen: '/games/race' }, 
  { id: '3', name: 'Capy Clicker', screen: '/games/clicker' },
];

export default function GamesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Minijogos</ThemedText>
      <ThemedText>Jogue para aumentar a felicidade da sua capivara!</ThemedText>

      <FlatList
        data={miniGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={item.screen} asChild>
            <TouchableOpacity style={styles.card}>
              <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
            </TouchableOpacity>
          </Link>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#ffccfe',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});