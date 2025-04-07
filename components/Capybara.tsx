import { Image, StyleSheet, Animated } from 'react-native';
import React from 'react';

type CapybaraProps = {
  isSleeping: boolean;
  hunger: number;
  happiness: number;
};

const Capybara = ({ isSleeping, hunger, happiness }: CapybaraProps) => {
  const getCapybaraImage = () => {
    if (isSleeping) return require('../assets/images/capybara-sleeping.png');
    if (happiness < 30) return require('../assets/images/capybara-sad.png');
    if (hunger < 30) return require('../assets/images/capybara-hungry.png');
    return require('../assets/images/capybara-happy.png');
  };

  return (
    <Animated.Image 
      source={getCapybaraImage()} 
      style={styles.image} 
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default Capybara;