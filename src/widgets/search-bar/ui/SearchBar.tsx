import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Icon} from '@/shared/ui';
import {colors, spacing, borderRadius, typography} from '@/shared/config';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search notes...',
}: SearchBarProps): React.JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Simple debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedValue !== value) {
        onChangeText(debouncedValue);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [debouncedValue, onChangeText, value]);

  // Update internal state if external value changes (e.g. cleared from outside)
  useEffect(() => {
    setDebouncedValue(value);
  }, [value]);

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <Icon
        name="magnify"
        size="md"
        color={isFocused ? colors.accent : colors.textDisabled}
      />
      <TextInput
        style={styles.input}
        value={debouncedValue}
        onChangeText={setDebouncedValue}
        placeholder={placeholder}
        placeholderTextColor={colors.textDisabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={colors.accent}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {debouncedValue.length > 0 && (
        <Icon
          name="close-circle"
          size="sm"
          color={colors.textDisabled}
          onPress={() => {
            setDebouncedValue('');
            onClear();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerFocused: {
    borderColor: colors.accent,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.primary,
  },
});
