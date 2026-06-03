import React, {useState} from 'react';
import {Modal, StyleSheet, Text, TextInput, View} from 'react-native';
import {Button} from '@/shared/ui';
import {colors, spacing, borderRadius, typography, addAlpha} from '@/shared/config';

interface PasswordDialogProps {
  visible: boolean;
  mode: 'export' | 'import';
  onSubmit: (password: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function PasswordDialog({
  visible,
  mode,
  onSubmit,
  onCancel,
  isLoading,
}: PasswordDialogProps): React.JSX.Element {
  const [password, setPassword] = useState('');

  const title = mode === 'export' ? 'Backup Password' : 'Enter Password';
  const description =
    mode === 'export'
      ? 'Set a strong password to encrypt your backup.'
      : 'Enter the password you used to encrypt this backup.';
  const submitLabel = mode === 'export' ? 'Encrypt & Export' : 'Decrypt & Import';
  const isSubmitDisabled = password.length < 4 || isLoading;

  const handleSubmit = () => {
    onSubmit(password);
    setPassword('');
  };

  const handleCancel = () => {
    onCancel();
    setPassword('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.textDisabled}
            secureTextEntry
            selectionColor={colors.accent}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.actions}>
            <Button label="Cancel" variant="ghost" onPress={handleCancel} disabled={isLoading} />
            <View style={styles.gap} />
            <Button label={submitLabel} variant="primary" onPress={handleSubmit} disabled={isSubmitDisabled} />
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
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  gap: {
    width: spacing.sm,
  },
});
