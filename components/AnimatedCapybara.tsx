// components/AnimatedCapybara.tsx
import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, View } from 'react-native';

type CapybaraState = 'happy' | 'hungry' | 'sleepy' | 'sleeping' | 'sad';

interface AnimatedCapybaraProps {
  state: CapybaraState;
  size?: number;
}

export const AnimatedCapybara: React.FC<AnimatedCapybaraProps> = ({ 
  state = 'normal', 
  size = 200 
}) => {
  const spinValue = new Animated.Value(0);
  
  // Mapeamento dos GIFs para cada estado
  // components/AnimatedCapybara.tsx

    const gifMap: Record<CapybaraState, ImageSourcePropType> = {
    happy: require('@/assets/capybara/happy.gif'),
    hungry: require('@/assets/capybara/hungry.gif'),
    sleepy: require('@/assets/capybara/sleepy.gif'),
    sleeping: require('@/assets/capybara/sleeping.gif'), 
    sad: require('@/assets/capybara/sad.gif'),
    eating: require('@/assets/capybara/eating.gif'),
    };
    

  // Animação de flutuação (para estado normal)
  useEffect(() => {
    if (state === 'normal') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(spinValue, {
            toValue: 0,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [state]);

  const translateY = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.Image
        source={gifMap[state]}
        style={{
          width: size,
          height: size,
          transform: [{ translateY }],
        }}
        resizeMode="contain"
      />
    </View>
  );
};