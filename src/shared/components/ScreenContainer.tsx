import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundField } from './BackgroundField';

export interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  background?: 'plain' | 'field';
}

export function ScreenContainer({
  children,
  className,
  noPadding = false,
  background = 'plain',
}: ScreenContainerProps) {
  const inner = (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ flex: 1 }}
        className={[!noPadding && 'px-md py-md', className].filter(Boolean).join(' ')}
      >
        {children}
      </View>
    </SafeAreaView>
  );

  if (background === 'field') {
    return <BackgroundField>{inner}</BackgroundField>;
  }

  return <View style={{ flex: 1, backgroundColor: '#0B1126' }}>{inner}</View>;
}

export default ScreenContainer;
