import React from 'react';
import { Text } from 'react-native';

type ThemedTextProps = React.ComponentProps<typeof Text>;

export function ThemedText({ className = '', ...props }: ThemedTextProps) {
  return (
    <Text 
      className={`text-on-background ${className}`} 
      {...props}
    />
  );
}