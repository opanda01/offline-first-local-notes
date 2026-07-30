import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ExportBackupButton, ImportBackupButton} from '@/features/backup-vault';
import {CategoryManagerModal} from '@/widgets/category-manager';
import {NoteStats} from '@/widgets/note-stats';
import {colors, spacing, typography} from '@/shared/config';
import {SettingsRow} from '@/shared/ui';

const TECH_STACK: {label: string; value: string}[] = [
  {label: 'App', value: 'Secret (offline-first)'},
  {label: 'Version', value: '0.0.1'},
  {label: 'Framework', value: 'React Native 0.85'},
  {label: 'Language', value: 'TypeScript'},
  {label: 'Architecture', value: 'Feature-Sliced Design'},
  {label: 'Storage', value: 'MMKV'},
  {label: 'Encryption', value: 'AES-256-CBC'},
  {label: 'Navigation', value: 'React Navigation 7'},
  {label: 'Backup I/O', value: 'FS, Share, Document Picker'},
];

export function SettingsPage(): React.JSX.Element {
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {paddingBottom: insets.bottom + spacing.xxl + 72},
      ]}
      showsVerticalScrollIndicator>
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
          {TECH_STACK.map((item, index) => (
            <View key={item.label}>
              {index > 0 ? <View style={styles.aboutDivider} /> : null}
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>{item.label}</Text>
                <Text style={styles.aboutValue}>{item.value}</Text>
              </View>
            </View>
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
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  aboutLabel: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
  aboutValue: {
    flex: 1.2,
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: colors.primary,
    textAlign: 'right',
  },
  aboutDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md,
  },
});
