import React from 'react';
import { View, type ViewProps } from 'react-native';

export interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
}

export function GlassCard({ children, className, strong = false, ...rest }: GlassCardProps) {
  const surface = strong ? 'bg-surface-strong' : 'bg-surface';
  return (
    <View
      className={['rounded-xl border border-border', surface, className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </View>
  );
}

export default GlassCard;
