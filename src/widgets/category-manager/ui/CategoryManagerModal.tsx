import React, {useState} from 'react';
import {Modal, StyleSheet, View, Text, Pressable, SafeAreaView} from 'react-native';
import {CategoryPicker} from '@/features/add-note/components/CategoryPicker';
import {colors, spacing, typography} from '@/shared/config';
import {Icon} from '@/shared/ui';

interface CategoryManagerModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CategoryManagerModal({visible, onClose}: CategoryManagerModalProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Categories</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Icon name="close" size="md" color={colors.primary} />
          </Pressable>
        </View>
        <View style={styles.content}>
          <Text style={styles.instruction}>
            Tap a category to add subcategories, or long-press to delete.
          </Text>
          {/* We remove max-height from CategoryPicker inside a modal to allow it to fill space if needed, 
              but since it's an imported component, we just wrap it in a flex view. */}
          <View style={styles.pickerContainer}>
            <CategoryPicker 
              selectedId={selectedId}
              onSelect={setSelectedId} 
              visible={visible} 
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  instruction: {
    fontSize: typography.caption.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  pickerContainer: {
    flex: 1,
  },
});
