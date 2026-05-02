import React from 'react';
import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const VARIANT_CONTAINER: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  ghost: 'bg-transparent border-2 border-primary',
  danger: 'bg-danger',
};

const VARIANT_LABEL: Record<ButtonVariant, string> = {
  primary: 'text-white',
  ghost: 'text-primary',
  danger: 'text-white',
};

export function Button({
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
  className,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      className={[
        'min-h-[56px] min-w-[56px] rounded-md px-lg py-sm items-center justify-center',
        VARIANT_CONTAINER[variant],
        'active:opacity-80',
        isDisabled && 'opacity-[0.45]',
        className,
      ].filter(Boolean).join(' ')}
    >
      {loading ? (
        <ActivityIndicator colorClassName={variant === 'ghost' ? 'text-primary' : 'text-white'} accessibilityLabel="Loading" />
      ) : (
        <Text
          className={[
            'text-body font-semibold',
            VARIANT_LABEL[variant],
            isDisabled && 'opacity-70',
          ].filter(Boolean).join(' ')}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export default Button;
