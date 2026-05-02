import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, type } from '@/src/shared/constants/theme';

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
    <View style={styles.container} accessibilityRole="tablist" accessibilityLabel={accessibilityLabel}>
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.segment,
              isFirst && styles.segmentFirst,
              isLast && styles.segmentLast,
              isSelected && styles.segmentSelected,
              pressed && !isSelected && styles.segmentPressed,
            ]}
          >
            <Text
              style={[styles.label, isSelected && styles.labelSelected]}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    minHeight: 56,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    minHeight: 56,
  },
  segmentFirst: { borderLeftWidth: 0 },
  segmentLast: { borderRightWidth: 0 },
  segmentSelected: { backgroundColor: colors.primary },
  segmentPressed: { backgroundColor: colors.border },
  label: { ...type.body, fontWeight: '600', color: colors.text.primary, textAlign: 'center' },
  labelSelected: { color: '#FFFFFF' },
});

export default SegmentedControl;
