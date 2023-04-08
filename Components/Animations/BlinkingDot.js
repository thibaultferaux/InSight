import React from 'react';
import { Animated, Easing, View } from 'react-native';

const BlinkingDot = ({ size = 5, color = 'black' }) => {
  const opacity = new Animated.Value(1);

  Animated.loop(
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        delay: 500,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        delay: 300,
      }),
    ])
  ).start();

  return (
    <Animated.View
        className="h-[6px] w-[6px] rounded-full bg-white/70"
        style={{
            opacity: opacity,
        }}
    />
  );
};

export default BlinkingDot;