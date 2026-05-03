import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export interface IconTileProps {
  icon: IoniconName;
  size?: number;
  iconSize?: number;
  className?: string;
  colors?: readonly [string, string, ...string[]];
}

export function IconTile({
  icon,
  size = 96,
  iconSize,
  className,
  colors = ['#5B7FFF', '#A06BFF'],
}: IconTileProps) {
  const resolvedIconSize = iconSize ?? Math.round(size * 0.45);
  return (
    <View
      className={['rounded-xl overflow-hidden', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Ionicons name={icon} size={resolvedIconSize} color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}

export default IconTile;
