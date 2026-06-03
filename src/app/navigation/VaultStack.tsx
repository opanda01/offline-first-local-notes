import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VaultPage, EditNotePage} from '@/pages';
import type {VaultStackParamList} from './types';

const Stack = createNativeStackNavigator<VaultStackParamList>();

export function VaultStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Vault" component={VaultPage} />
      <Stack.Screen name="EditNote" component={EditNotePage} />
    </Stack.Navigator>
  );
}
