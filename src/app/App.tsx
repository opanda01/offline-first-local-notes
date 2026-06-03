import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {storage} from '@/shared/lib/mmkv-storage';
import {categoryRepository, DEFAULT_CATEGORIES} from '@/entities/category';
import {colors} from '@/shared/config';
import {RootNavigator} from './navigation';
import {ErrorBoundary} from './providers/ErrorBoundary';

export function App(): React.JSX.Element {
  useEffect(() => {
    // Seed default categories on first run
    const isInitialized = storage.contains('app:initialized');
    if (!isInitialized) {
      DEFAULT_CATEGORIES.forEach(cat => categoryRepository.create(cat));
      storage.set('app:initialized', true);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <View style={styles.root}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          <RootNavigator />
        </View>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
