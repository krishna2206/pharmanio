import React from 'react';
import { Pressable, Text } from 'react-native';

type ThemedButtonProps = React.ComponentProps<typeof Pressable> & {
  variant?: 'primary' | 'secondary' | 'surface' | 'warning';
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
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-primary';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'surface':
        return 'text-on-surface';
      case 'warning':
        return 'text-on-primary';
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