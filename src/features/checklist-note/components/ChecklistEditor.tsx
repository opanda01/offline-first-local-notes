import React from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {generateNoteId, type ChecklistItem} from '@/entities/note';
import {Icon} from '@/shared/ui';
import {colors, spacing, typography} from '@/shared/config';

interface ChecklistEditorProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

export function ChecklistEditor({items, onChange}: ChecklistEditorProps): React.JSX.Element {
  const updateItem = (id: string, patch: Partial<ChecklistItem>) => {
    onChange(items.map(item => (item.id === id ? {...item, ...patch} : item)));
  };

  const addItem = () => {
    onChange([
      ...items,
      {id: generateNoteId(), text: '', checked: false, indentLevel: 0},
    ]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const indentItem = (id: string, delta: number) => {
    onChange(
      items.map(item => {
        if (item.id !== id) return item;
        const next = Math.max(0, (item.indentLevel ?? 0) + delta);
        return {...item, indentLevel: next};
      }),
    );
  };

  return (
    <View style={styles.container}>
      {items.map(item => (
        <View key={item.id} style={[styles.row, {marginLeft: (item.indentLevel ?? 0) * spacing.md}]}>
          <Pressable
            onPress={() => updateItem(item.id, {checked: !item.checked})}
            style={styles.checkBtn}>
            <Icon
              name={item.checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size="md"
              color={item.checked ? colors.accent : colors.textSecondary}
            />
          </Pressable>
          <TextInput
            style={styles.input}
            value={item.text}
            onChangeText={text => updateItem(item.id, {text})}
            placeholder="List item"
            placeholderTextColor={colors.textDisabled}
            selectionColor={colors.accent}
          />
          <Pressable onPress={() => indentItem(item.id, 1)} style={styles.iconBtn}>
            <Icon name="format-indent-increase" size="sm" color={colors.textSecondary} />
          </Pressable>
          <Pressable onPress={() => removeItem(item.id)} style={styles.iconBtn}>
            <Icon name="close" size="sm" color={colors.textSecondary} />
          </Pressable>
        </View>
      ))}
      <Pressable onPress={addItem} style={styles.addRow}>
        <Icon name="plus" size="sm" color={colors.accent} />
        <Text style={styles.addText}>Add item</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  checkBtn: {
    padding: spacing.xs,
  },
  input: {
    flex: 1,
    color: colors.primary,
    fontSize: typography.body.fontSize,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.xs,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  addText: {
    color: colors.accent,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
});
