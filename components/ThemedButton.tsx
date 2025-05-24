import React from 'react';
import { Pressable, Text } from 'react-native';

type ThemedButtonProps = React.ComponentProps<typeof Pressable> & {
  variant?: 'primary' | 'secondary' | 'surface';
  textClassName?: string;
  children: React.ReactNode;
};

export function ThemedButton({
  variant = 'primary',
  className = '',
  textClassName = '',
  children,
  ...props
}: ThemedButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'surface':
        return 'bg-surface border border-border';
      default:
        return 'bg-primary';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'surface':
        return 'text-on-surface';
      default:
        return 'text-on-primary';
    }
  };

  return (
    <Pressable
      className={`py-3 px-6 rounded-lg ${getVariantClasses()} ${className}`}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={`font-medium text-center ${getTextClasses()} ${textClassName}`}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}