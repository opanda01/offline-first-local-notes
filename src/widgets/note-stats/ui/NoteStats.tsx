import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {noteRepository, getWordCount, formatRelativeTime} from '@/entities/note';
import {categoryRepository} from '@/entities/category';
import {colors, spacing, borderRadius, typography} from '@/shared/config';

export function NoteStats(): React.JSX.Element {
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
    <View style={styles.container}>
      <Text style={styles.title}>Vault Statistics</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Total Notes</Text>
        <Text style={styles.value}>{stats.noteCount}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Categories</Text>
        <Text style={styles.value}>{stats.categoryCount}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Total Words</Text>
        <Text style={styles.value}>{stats.wordCount}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Last Update</Text>
        <Text style={styles.value}>
          {stats.lastUpdate > 0 ? formatRelativeTime(stats.lastUpdate) : 'Never'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as any,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
