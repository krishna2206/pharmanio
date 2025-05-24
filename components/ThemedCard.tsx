import React from 'react';
import { View } from 'react-native';

type ThemedCardProps = React.ComponentProps<typeof View>;

export function ThemedCard({ className = '', ...props }: ThemedCardProps) {
  return (
    <View 
      className={`bg-surface border border-border rounded-lg p-4 ${className}`} 
      {...props}
    />
  );
}