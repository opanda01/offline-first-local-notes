import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {ExportBackupButton, ImportBackupButton} from '@/features/backup-vault';
import {CategoryManagerModal} from '@/widgets/category-manager';
import {NoteStats} from '@/widgets/note-stats';
import {colors, spacing, typography} from '@/shared/config';
import {SettingsRow} from '@/shared/ui';

const TECH_STACK: {label: string; value: string; icon?: string}[] = [
  {label: 'App', value: 'Secret (offline-first)', icon: 'shield-lock-outline'},
  {label: 'Version', value: '0.0.1', icon: 'tag-outline'},
  {label: 'Framework', value: 'React Native 0.85', icon: 'cellphone'},
  {label: 'Language', value: 'TypeScript', icon: 'language-typescript'},
  {label: 'Architecture', value: 'Feature-Sliced Design', icon: 'sitemap-outline'},
  {label: 'Storage', value: 'MMKV', icon: 'database-outline'},
  {label: 'Encryption', value: 'AES-256-CBC', icon: 'lock-outline'},
  {label: 'Navigation', value: 'React Navigation 7', icon: 'routes'},
  {label: 'Backup I/O', value: 'FS, Share, Document Picker', icon: 'folder-outline'},
];

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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          {TECH_STACK.map(item => (
            <SettingsRow
              key={item.label}
              label={item.label}
              value={item.value}
              icon={item.icon}
            />
          ))}
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
