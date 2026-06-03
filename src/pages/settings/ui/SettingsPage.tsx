import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {NoteStats} from '@/widgets';
import {ExportBackupButton, ImportBackupButton} from '@/features/backup-vault';
import {colors, spacing, typography} from '@/shared/config';

export function SettingsPage(): React.JSX.Element {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SETTINGS</Text>
        <Text style={styles.title}>Preferences</Text>
      </View>

      <View style={styles.section}>
        <NoteStats />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <ExportBackupButton />
        <ImportBackupButton />
      </View>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  eyebrow: {
    color: colors.textSecondary,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
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
    color: colors.primary,
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as any,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  placeholderBox: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: typography.body.fontSize,
  },
});
