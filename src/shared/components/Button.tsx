import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View, type PressableProps } from 'react-native';

export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'gradient';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  leadingIcon?: IoniconName;
  trailingIcon?: IoniconName;
}

const VARIANT_CONTAINER: Record<Exclude<ButtonVariant, 'gradient'>, string> = {
  primary: 'bg-primary',
  ghost: 'bg-transparent border border-border',
  danger: 'bg-danger',
};

const VARIANT_LABEL: Record<ButtonVariant, string> = {
  primary: 'text-white',
  ghost: 'text-text-primary',
  danger: 'text-white',
  gradient: 'text-white',
};

export function Button({
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
  className,
  accessibilityLabel,
  accessibilityHint,
  leadingIcon,
  trailingIcon,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isGradient = variant === 'gradient';

  const labelNode = loading ? (
    <ActivityIndicator
      colorClassName={variant === 'ghost' ? 'text-text-primary' : 'text-white'}
      accessibilityLabel="Loading"
    />
  ) : (
    <View className="flex-row items-center justify-center gap-sm">
      {leadingIcon ? <Ionicons name={leadingIcon} size={22} color="#FFFFFF" /> : null}
      <Text
        className={[
          isGradient ? 'text-h2' : 'text-body',
          'font-bold tracking-wide',
          VARIANT_LABEL[variant],
          isDisabled && 'opacity-70',
        ]
          .filter(Boolean)
          .join(' ')}
        numberOfLines={1}
      >
        {label}
      </Text>
      {trailingIcon ? <Ionicons name={trailingIcon} size={22} color="#FFFFFF" /> : null}
    </View>
  );

  if (isGradient) {
    return (
      <Pressable
        {...rest}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled }}
        className={[
          'min-h-[64px] rounded-xl overflow-hidden',
          'active:opacity-90',
          isDisabled && 'opacity-[0.45]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <LinearGradient
          colors={['#5B7FFF', '#A06BFF']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
            paddingVertical: 16,
          }}
        >
          {labelNode}
        </LinearGradient>
      </Pressable>
    );
  }

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
        VARIANT_CONTAINER[variant as Exclude<ButtonVariant, 'gradient'>],
        'active:opacity-80',
        isDisabled && 'opacity-[0.45]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {labelNode}
    </Pressable>
  );
}

export default Button;
