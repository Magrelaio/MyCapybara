import { View, Text, StyleSheet } from 'react-native';

export default function race() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍬 Corrida Maluca 🍬</Text>
      <Text>Jogo Corrida Maluca em desenvolvimento...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fce4ec',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
