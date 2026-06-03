import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {Button} from '@/shared/ui';
import {colors, spacing, borderRadius, typography, addAlpha} from '@/shared/config';

interface DeleteConfirmDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({
  visible,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Delete Note</Text>
          <Text style={styles.message}>
            Are you sure you want to delete this note? This action cannot be undone.
          </Text>
          <View style={styles.actions}>
            <Button label="Cancel" variant="ghost" onPress={onCancel} />
            <View style={styles.gap} />
            <Button label="Delete" variant="danger" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: addAlpha('#000000', 0.6),
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as any,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  gap: {
    width: spacing.sm,
  },
});
