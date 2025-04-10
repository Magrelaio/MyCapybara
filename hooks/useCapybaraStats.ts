// hooks/useCapybaraStats.ts
import { useState, useEffect } from 'react';

type CapybaraState = 'happy' | 'hungry' | 'sleepy' | 'sleeping' | 'sad' | 'eating';

export function useCapybaraStats() {
  // Estados básicos
  const [hunger, setHunger] = useState(50);
  const [happiness, setHappiness] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [cleanliness, setCleanliness] = useState(50);
  const [isSleeping, setIsSleeping] = useState(false);
  const [visualState, setVisualState] = useState<CapybaraState>('happy');
  const [age, setAge] = useState(0); // em dias

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
    } else if (visualState !== 'eating') {
      setVisualState('happy');
    }
  }, [hunger, happiness, energy, isSleeping]);

  // Diminui os stats com o tempo
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSleeping) {
        setHunger(prev => Math.max(0, prev - 1));
        setHappiness(prev => Math.max(0, prev - 0.5));
        setCleanliness(prev => Math.max(0, prev - 0.3));
      }
      
      setEnergy(prev => {
        const newValue = prev + (isSleeping ? 2 : -1.0);
        return Math.min(100, Math.max(0, newValue));
      });
      
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
      
      // Volta para estado normal após comer
      setTimeout(() => {
        setVisualState(happiness >= 30 ? 'happy' : 'sad');
      }, 1500);
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
    setVisualState(isSleeping ? 'happy' : 'sleeping');
  };

  const clean = () => {
    if (!isSleeping) {
      setCleanliness(100);
      setHappiness(prev => Math.min(100, prev + 5));
    }
  };

  // Callback quando um jogo é completado
  const gameCompleted = (happinessGain: number) => {
    setHappiness(prev => Math.min(100, prev + happinessGain));
    setEnergy(prev => Math.max(0, prev - 10));
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
    gameCompleted,
    
    setVisualState,
  };
}