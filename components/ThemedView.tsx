import React from 'react';
import { View } from 'react-native';

type ThemedViewProps = React.ComponentProps<typeof View>;

export function ThemedView({ className = '', ...props }: ThemedViewProps) {
  return (
    <View 
      className={`bg-background ${className}`} 
      {...props}
    />
  );
}