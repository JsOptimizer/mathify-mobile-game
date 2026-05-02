import React from 'react';
import { View, Pressable, Text } from 'react-native';

export interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel = 'Segmented control',
}: SegmentedControlProps<T>) {
  return (
    <View
      className="flex-row bg-surface rounded-md border border-border overflow-hidden min-h-[56px]"
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isLast = index === options.length - 1;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
            className={[
              'flex-1 items-center justify-center py-sm px-sm min-h-[56px]',
              !isLast && 'border-r border-border',
              isSelected && 'bg-primary',
              !isSelected && 'active:bg-border',
            ].filter(Boolean).join(' ')}
          >
            <Text
              className={[
                'text-body font-semibold text-center',
                isSelected ? 'text-white' : 'text-text-primary',
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
