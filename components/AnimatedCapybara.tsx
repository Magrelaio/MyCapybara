// components/AnimatedCapybara.tsx
import React, { useEffect } from 'react';
import { Animated, Easing, Image, View, StyleSheet } from 'react-native';

type CapybaraState = 'happy' | 'hungry' | 'sleepy' | 'sleeping' | 'sad' | 'eating';

interface AnimatedCapybaraProps {
  state: CapybaraState;
  size?: number;
  cleanliness: number;
}

export const AnimatedCapybara: React.FC<AnimatedCapybaraProps> = ({ 
  state = 'happy', 
  size = 200,
  cleanliness = 100 
}) => {
  const spinValue = new Animated.Value(0);
  
  // Sprites principais (verifique os caminhos!)
  const gifMap = {
    happy: require('@/assets/capybara/happy.gif'),
    hungry: require('@/assets/capybara/hungry.gif'),
    sleepy: require('@/assets/capybara/sleepy.gif'),
    sleeping: require('@/assets/capybara/sleeping.gif'),
    sad: require('@/assets/capybara/sad.gif'),
    eating: require('@/assets/capybara/eating.gif'),
  };

  // GIF de sujeira (caminho relativo garantido)
  const dirtOverlay = require('@/assets/capybara/dirt_overlay.gif');

  // Animação de flutuação
  useEffect(() => {
    if (state === 'happy') {
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
    <View style={styles.centeredContainer}>
      <View style={[styles.animationContainer, { width: size, height: size }]}>
        {/* Sprite principal */}
        <Animated.Image
          source={gifMap[state]}
          style={[
            styles.sprite,
            { 
              width: '100%', 
              height: '100%',
              transform: [{ translateY }] 
            }
          ]}
          resizeMode="contain"
        />
        
        {/* Overlay de sujeira - aparece quando cleanliness < 50 */}
        {cleanliness < 50 && (
          <Animated.Image
            source={dirtOverlay}
            style={[
              styles.sprite,
              styles.dirtOverlay,
              { 
                width: '100%', 
                height: '100%',
                transform: [{ translateY }],
                opacity: 1 - (cleanliness / 50) // Opacidade baseada na limpeza
              }
            ]}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  animationContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sprite: {
    position: 'absolute',
  },
  dirtOverlay: {
    zIndex: 1,
  },
});