import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CapybaraStats } from '../../MyCapybara/app/(tabs)/src/store/CapybaraStats.js';
//import { OBJECTS } from './store/objects';

type CapybaraState = 'happy' | 'hungry' | 'sleepy' | 'sleeping' | 'sad' | 'eating';

const STORAGE_KEY = 'capybara_stats';

export const useCapybaraStats = () => {
  const [hunger, setHunger] = useState(80);
  const [happiness, setHappiness] = useState(80);
  const [energy, setEnergy] = useState(80);
  const [cleanliness, setCleanliness] = useState(80);
  const [isSleeping, setIsSleeping] = useState(false);
  const [visualState, setVisualState] = useState<CapybaraState>('happy');
  const [age, setAge] = useState(0);
  const [animationLock, setAnimationLock] = useState(false);

  useEffect(() => {
    if (animationLock) return;
    if (isSleeping) {
      setVisualState('sleeping');
    } else if (hunger < 30) {
      setVisualState('hungry');
    } else if (energy < 30) {
      setVisualState('sleepy');
    } else if (happiness < 30) {
      setVisualState('sad');
    } else {
      setVisualState('happy');
    }
  }, [hunger, happiness, energy, isSleeping, animationLock]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSleeping) {
        setHunger(prev => Math.max(0, prev - 1));
        setHappiness(prev => Math.max(0, prev - 0.5));
        setCleanliness(prev => Math.max(0, prev - 0.5));
      }
      setEnergy(prev => Math.min(100, Math.max(0, prev + (isSleeping ? 2 : -0.7))));
      setAge(prev => prev + 0.01);
    }, 3000);

    return () => clearInterval(timer);
  }, [isSleeping]);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          if (typeof data.hunger === 'number') setHunger(data.hunger);
          if (typeof data.happiness === 'number') setHappiness(data.happiness);
          if (typeof data.energy === 'number') setEnergy(data.energy);
          if (typeof data.cleanliness === 'number') setCleanliness(data.cleanliness);
          if (typeof data.isSleeping === 'boolean') setIsSleeping(data.isSleeping);
          if (typeof data.visualState === 'string') setVisualState(data.visualState);
          if (typeof data.age === 'number') setAge(data.age);
              if (typeof data.coins === 'number') {
          CapybaraStats.setState({ coins: data.coins });
        }
        if (Array.isArray(data.inventory)) {
          CapybaraStats.setState({ inventory: data.inventory });
        }
        if (Array.isArray(data.placedObjects)) {
          CapybaraStats.setState({ placedObjects: data.placedObjects });
        }
      }
      } catch (e) {
        Alert.alert('Erro ao carregar os dados', 'Não foi possível carregar os dados salvos.');
      }
    })();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            hunger,
            happiness,
            energy,
            cleanliness,
            isSleeping,
            visualState,
            age,
            coins: CapybaraStats.getState().coins,
            inventory: CapybaraStats.getState().inventory,
            placedObjects: CapybaraStats.getState().placedObjects, 
          })
        );
      } catch (e) {
      }
    };
    save();
   }, [hunger, happiness, energy, cleanliness, isSleeping, visualState, age, CapybaraStats.getState().coins, CapybaraStats.getState().inventory, CapybaraStats.getState().placedObjects]);

  const feed = () => {
    if (!isSleeping) {
      setHunger(prev => Math.min(100, prev + 20));
      setCleanliness(prev => Math.max(0, prev - 5));
      setVisualState('eating');
      setAnimationLock(true);
      setTimeout(() => {
        setAnimationLock(false);
        setVisualState('happy');
      }, 1000);
    }
  };

  const play = () => {
    if (!isSleeping && energy > 10) {
      setHappiness(prev => Math.min(100, prev + 15));
      setEnergy(prev => Math.max(0, prev - 10));
      setHunger(prev => Math.max(0, prev - 5));
    }
  };

  const sleep = () => {
    setIsSleeping(!isSleeping);
  };

  const clean = () => {
    if (!isSleeping) {
      setCleanliness(100);
      setHappiness(prev => Math.min(100, prev + 5));
    }
  };

  return {
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
    
    setVisualState,
  };
};