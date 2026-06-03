import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {storage} from '@/shared/lib/mmkv-storage';
import {categoryRepository} from '@/entities/category';
import {colors} from '@/shared/config';
import {RootNavigator} from './navigation';
import {ErrorBoundary} from './providers/ErrorBoundary';

export function App(): React.JSX.Element {
  useEffect(() => {
    const isInitialized = storage.contains('app:initialized');
    if (!isInitialized) {
      storage.set('app:initialized', true);
    }

    const isCleanedUp = storage.contains('app:cleaned_defaults_v2');
    if (!isCleanedUp) {
      const all = categoryRepository.getAll();
      const defaultNames = ['Personal', 'Work', 'Ideas'];
      for (const cat of all) {
        if (defaultNames.includes(cat.name)) {
          categoryRepository.delete(cat.id);
        }
      }
      storage.set('app:cleaned_defaults_v2', true);
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
