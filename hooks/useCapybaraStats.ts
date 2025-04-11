// hooks/useCapybaraStats.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

type CapybaraState = 'happy' | 'hungry' | 'sleepy' | 'sleeping' | 'sad' | 'eating';

export const useCapybaraStats = () => {
  const [hunger, setHunger] = useState(80);
  const [happiness, setHappiness] = useState(80);
  const [energy, setEnergy] = useState(80);
  const [cleanliness, setCleanliness] = useState(80);
  const [isSleeping, setIsSleeping] = useState(false);
  const [visualState, setVisualState] = useState<CapybaraState>('happy');
  const [age, setAge] = useState(0);

  // Atualiza o estado visual baseado nos stats
  useEffect(() => {
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
  }, [hunger, happiness, energy, isSleeping]);

  // Diminui os stats com o tempo
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

  // Ações do jogador
  const feed = () => {
    if (!isSleeping) {
      setHunger(prev => Math.min(100, prev + 20));
      setCleanliness(prev => Math.max(0, prev - 5));
      setVisualState('eating');
      setTimeout(() => setVisualState('happy'), 1000);
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
    // Estados
    hunger,
    happiness,
    energy,
    cleanliness,
    isSleeping,
    visualState,
    age,
    
    // Ações
    feed,
    play,
    sleep,
    clean,
    
    // Setters (se necessário)
    setVisualState,
  };
};