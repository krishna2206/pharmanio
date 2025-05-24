import React from 'react';
import { View } from 'react-native';

type ThemedSurfaceProps = React.ComponentProps<typeof View>;

export function ThemedSurface({ className = '', ...props }: ThemedSurfaceProps) {
  return (
    <View 
      className={`bg-surface ${className}`} 
      {...props}
    />
  );
}