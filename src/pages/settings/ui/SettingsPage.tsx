import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {ExportBackupButton, ImportBackupButton} from '@/features/backup-vault';
import {CategoryManagerModal} from '@/widgets/category-manager';
import {noteRepository, getWordCount, formatRelativeTime} from '@/entities/note';
import {categoryRepository} from '@/entities/category';
import {colors, spacing, typography} from '@/shared/config';
import {SettingsRow} from '@/shared/ui';

export function SettingsPage(): React.JSX.Element {
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [stats, setStats] = useState({
    noteCount: 0,
    categoryCount: 0,
    wordCount: 0,
    lastUpdate: 0,
  });

  useFocusEffect(
    useCallback(() => {
      const notes = noteRepository.getAll();
      const categories = categoryRepository.getAll();

      const wordCount = notes.reduce(
        (sum, note) => sum + getWordCount(note.content),
        0,
      );

      const lastUpdate = notes.reduce(
        (latest, note) => Math.max(latest, note.updatedAt),
        0,
      );

      setStats({
        noteCount: notes.length,
        categoryCount: categories.length,
        wordCount,
        lastUpdate,
      });
    }, []),
  );

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
            value={stats.categoryCount} 
            icon="format-list-bulleted"
            onPress={() => setCategoryModalVisible(true)} 
          />
          <SettingsRow 
            label="Total Notes" 
            value={stats.noteCount} 
            icon="file-document-multiple-outline" 
          />
          <SettingsRow 
            label="Total Words" 
            value={stats.wordCount} 
            icon="format-text" 
          />
          <SettingsRow 
            label="Last Updated" 
            value={stats.lastUpdate > 0 ? formatRelativeTime(stats.lastUpdate) : 'Never'} 
            icon="clock-outline" 
          />
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
