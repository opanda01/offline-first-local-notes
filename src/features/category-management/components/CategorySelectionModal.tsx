import React from 'react';
import {Modal, StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import {CategoryPicker} from './CategoryPicker';
import {Button} from '@/shared/ui';
import {colors, spacing, typography, borderRadius} from '@/shared/config';

interface CategorySelectionModalProps {
  visible: boolean;
  selectedCategoryId: string | undefined;
  onSelectCategory: (id: string | undefined) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}

export function CategorySelectionModal({
  visible,
  selectedCategoryId,
  onSelectCategory,
  onConfirm,
  onCancel,
  confirmLabel = 'Save Note',
}: CategorySelectionModalProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.dialog}>
              <Text style={styles.title}>Select Category</Text>

              <View style={styles.pickerContainer}>
                <CategoryPicker
                  selectedId={selectedCategoryId}
                  onSelect={onSelectCategory}
                  visible={visible}
                />
              </View>

              <View style={styles.actions}>
                <Button label="Cancel" variant="ghost" onPress={onCancel} />
                <Button label={confirmLabel} variant="primary" onPress={onConfirm} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: spacing.xl,
    marginHorizontal: -spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
});
