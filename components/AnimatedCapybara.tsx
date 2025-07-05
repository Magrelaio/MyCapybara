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
  
  // Sprites principais
  const gifMap = {
    happy: require('@/assets/capybara/happy.gif'),
    hungry: require('@/assets/capybara/hungry.gif'),
    sleepy: require('@/assets/capybara/sleepy.gif'),
    sleeping: require('@/assets/capybara/sleeping.gif'),
    sad: require('@/assets/capybara/sad.gif'),
    eating: require('@/assets/capybara/eating.gif'),
  };

  // GIF de sujeira
  const dirtOverlay = require('@/assets/capybara/dirt_overlay.gif');

  // Overlays de chapéu
  const chapeumorandoOverlay = require('@/assets/capybara/chapeumorando.gif');
  const chapeumorandoSadOverlay = require('@/assets/capybara/chapeumorando_sad.gif');

  const translateY = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  // Determina qual chapéu mostrar
  const showSadHat = state === 'hungry' || state === 'sleepy' || state === 'sleeping';

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

        {/* Overlay do chapeumorando - muda conforme o estado */}
        <Animated.Image
          source={showSadHat ? chapeumorandoSadOverlay : chapeumorandoOverlay}
          style={[
            styles.sprite,
            styles.chapeumorandoOverlay,
            { 
              width: '100%', 
              height: '100%',
              transform: [{ translateY }],
              opacity: 1,
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
                opacity: 1 - (cleanliness / 50)
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
  chapeumorandoOverlay: {
    zIndex: 2,
  },
});