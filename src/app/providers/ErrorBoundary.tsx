import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button, Icon} from '@/shared/ui';
import {colors, spacing, typography} from '@/shared/config';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real production app, you would log this to Sentry, Crashlytics, etc.
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({hasError: false, error: null});
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Icon name="alert-circle-outline" size="xl" color={colors.error} />
          <Text style={styles.title as any}>Something went wrong</Text>
          <Text style={styles.subtitle as any}>
            An unexpected error occurred. Your notes are safe on your device.
          </Text>
          
          {this.state.error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText} numberOfLines={3}>
                {this.state.error.message}
              </Text>
            </View>
          )}

          <Button label="Try Again" onPress={this.handleReset} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as any,
    color: colors.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.xl,
    width: '100%',
  },
  errorText: {
    color: colors.error,
    fontFamily: 'Courier',
    fontSize: 12,
  },
});
