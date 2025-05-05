import React, { useMemo } from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';

type CapybaraState = 'happy' | 'hungry' | 'sleepy' | 'sleeping' | 'sad' | 'eating';

interface AnimatedCapybaraProps {
  state: CapybaraState;
  size?: number;
  cleanliness: number;
}

export const AnimatedCapybara: React.FC<AnimatedCapybaraProps> = ({ 
  state = 'normal', 
  size = 210,
  cleanliness
}) => {
  const gifMap: Record<CapybaraState, ImageSourcePropType> = {
    happy: require('@/assets/capybara/happy.gif'),
    hungry: require('@/assets/capybara/hungry.gif'),
    sleepy: require('@/assets/capybara/sleepy.gif'),
    sleeping: require('@/assets/capybara/sleeping.gif'), 
    sad: require('@/assets/capybara/sad.gif'),
    eating: require('@/assets/capybara/eating.gif'),
  };

  const dirtOverlay = require('@/assets/capybara/dirt_overlay.gif');

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <View
        style={{
          width: size,
          height: size,
        }}
      >
        <Image
          source={gifMap[state]}
          style={{
            width: size,
            height: size,
          }}
          resizeMode="contain"
        />
        <Image
          source={dirtOverlay}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            opacity: cleanliness < 30 ? 1 : 0,
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};