import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { GlassCard } from './GlassCard';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export interface StatCardProps {
  icon: IoniconName;
  iconColor?: string;
  caption: string;
  value: string;
  className?: string;
}

export function StatCard({
  icon,
  iconColor = '#FFFFFF',
  caption,
  value,
  className,
}: StatCardProps) {
  return (
    <GlassCard className={['p-lg', className].filter(Boolean).join(' ')}>
      <Ionicons name={icon} size={28} color={iconColor} />
      <Text
        className="text-caption font-bold text-text-muted mt-md uppercase"
        accessibilityRole="text"
      >
        {caption}
      </Text>
      <Text
        className="text-h1 font-bold text-text-primary mt-xs"
        style={{ fontFamily: 'Anton_400Regular' }}
      >
        {value}
      </Text>
    </GlassCard>
  );
}

export default StatCard;
