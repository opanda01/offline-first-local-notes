import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {Icon} from './Icon';
import {colors, spacing, typography} from '../config';

export interface SettingsRowProps {
  label: string;
  value?: string | number;
  icon?: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

export function SettingsRow({label, value, icon, onPress, isDestructive}: SettingsRowProps) {
  const textColor = isDestructive ? colors.error : colors.primary;
  
  return (
    <Pressable 
      onPress={onPress} 
      disabled={!onPress}
      style={({pressed}) => [
        styles.container,
        pressed && onPress && styles.pressed
      ]}>
      <View style={styles.left}>
        {icon && <Icon name={icon} size="md" color={textColor} />}
        <Text style={[styles.label, {color: textColor}, icon && {marginLeft: spacing.sm}]}>{label}</Text>
      </View>
      <View style={styles.right}>
        {value !== undefined && <Text style={styles.value}>{value}</Text>}
        {onPress && <Icon name="chevron-right" size="sm" color={colors.textDisabled} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.surfaceElevated,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },
  value: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
});
