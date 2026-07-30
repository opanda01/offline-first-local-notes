import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {ExportBackupButton, ImportBackupButton} from '@/features/backup-vault';
import {CategoryManagerModal} from '@/widgets/category-manager';
import {NoteStats} from '@/widgets/note-stats';
import {colors, spacing, typography} from '@/shared/config';
import {SettingsRow} from '@/shared/ui';

export function SettingsPage(): React.JSX.Element {
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vault Details</Text>
        <View style={styles.card}>
          <SettingsRow
            label="Manage Categories"
            icon="format-list-bulleted"
            onPress={() => setCategoryModalVisible(true)}
          />
          <NoteStats variant="embedded" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.card}>
          <ExportBackupButton />
          <ImportBackupButton />
        </View>
      </View>

      <CategoryManagerModal
        visible={isCategoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  title: {
    color: colors.primary,
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight as any,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    overflow: 'hidden',
  },
});
