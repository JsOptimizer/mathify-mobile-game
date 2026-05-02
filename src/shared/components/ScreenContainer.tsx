import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ScreenContainer({ children, className, noPadding = false }: ScreenContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View
        className={[
          'flex-1 bg-bg',
          !noPadding && 'px-md py-md',
          className,
        ].filter(Boolean).join(' ')}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

export default ScreenContainer;
