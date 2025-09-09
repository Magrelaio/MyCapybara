import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { OBJECTS } from './store/objects';
import { CapybaraStats } from './src/store/CapybaraStats.js';

export default function ShopScreen() {
  const coins = CapybaraStats((s) => s.coins);
  const buyObject = CapybaraStats((s) => s.buyObject);

  function handleBuy(obj) {
    const success = buyObject(obj);
    if (success) {
      Alert.alert('Comprado!', `Você comprou ${obj.name}`);
    } else {
      Alert.alert('Moedas insuficientes', 'Você não tem moedas suficientes.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loja</Text>
      <Text style={styles.coins}>Moedas: {coins}</Text>
      <FlatList
        data={OBJECTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text>{item.name}</Text>
            <Text>{item.price} moedas</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleBuy(item)}>
              <Text>Comprar</Text>
            </TouchableOpacity>
          </View>
        )}
        horizontal
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  coins: { marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 10, margin: 10, borderRadius: 10, alignItems: 'center' },
  image: { width: 60, height: 60, marginBottom: 5 },
  button: { backgroundColor: '#ffd700', padding: 8, borderRadius: 5, marginTop: 5 },
});
