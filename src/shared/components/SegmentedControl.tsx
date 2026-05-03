import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
  variant?: 'segmented' | 'pill';
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel = 'Segmented control',
  variant = 'segmented',
}: SegmentedControlProps<T>) {
  const isPill = variant === 'pill';
  return (
    <View
      className={[
        'flex-row bg-surface border border-border min-h-[56px] p-xs',
        isPill ? 'rounded-pill' : 'rounded-xl',
      ].join(' ')}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
            className={[
              'flex-1 items-center justify-center min-h-2xl px-sm',
              isPill ? 'rounded-pill' : 'rounded-lg',
              isSelected ? 'bg-primary' : 'active:bg-surface-strong',
            ].join(' ')}
          >
            <Text
              className={[
                'text-body font-bold text-center tracking-wide',
                isSelected ? 'text-white' : 'text-text-muted',
              ].join(' ')}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default SegmentedControl;
