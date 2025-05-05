import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useCapybaraStats } from '@/hooks/useCapybaraStats';
import { AnimatedCapybara } from '@/components/AnimatedCapybara';

export default function HomeScreen() {
  const {
    hunger,
    happiness,
    energy,
    cleanliness,
    isSleeping,
    visualState,
    age,
    
    feed,
    play,
    sleep,
    clean,
  } = useCapybaraStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MyCapybara</Text>
        <Link href="/games" asChild>
          <TouchableOpacity style={styles.gamesButton}>
            <Text>Jogos</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <AnimatedCapybara state={visualState} size={220} cleanliness={cleanliness} />

      <View style={styles.stats}>
        <Text>🍗 Fome: {hunger}/100 {hunger < 30 && '(Faminto!)'}</Text>
        <Text>😊 Felicidade: {happiness}/100 {happiness < 30 && '(Triste)'}</Text>
        <Text>💤 Energia: {energy}/100 {energy < 30 && '(Cansado)'}</Text>
        <Text> Limpeza: {cleanliness}/100</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={feed}>
          <Text>🍎 Alimentar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={play}>
          <Text>🎾 Brincar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, isSleeping && styles.sleepingButton]} 
          onPress={sleep}
        >
          <Text>{isSleeping ? '⏰ Acordar' : '🌙 Dormir'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clean}>
          <Text>🧼 Limpar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff0f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gamesButton: {
    backgroundColor: '#81c784',
    padding: 10,
    borderRadius: 5,
  },
  capybara: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  stats: {
    marginBottom: 20,
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: '#a3d9a5',
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  sleepingButton: {
    backgroundColor: '#ffcc80',
  },
});