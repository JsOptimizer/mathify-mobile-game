import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import type { Operator } from '@/src/features/game/types';

const ICON: Record<Operator, React.ComponentProps<typeof Ionicons>['name']> = {
  '+': 'add',
  '-': 'remove',
  '*': 'close',
};

export interface OperatorBadgeProps {
  operator: Operator;
  size?: number;
}

export function OperatorBadge({ operator, size = 64 }: OperatorBadgeProps) {
  return (
    <View
      className="rounded-pill bg-primary items-center justify-center"
      style={{
        width: size,
        height: size,
        shadowColor: '#5B7FFF',
        shadowOpacity: 0.6,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
      }}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <Ionicons name={ICON[operator]} size={Math.round(size * 0.55)} color="#FFFFFF" />
    </View>
  );
}

export default OperatorBadge;
