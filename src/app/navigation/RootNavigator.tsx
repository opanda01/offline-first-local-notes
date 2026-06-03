import React from 'react';
import {StyleSheet} from 'react-native';
import {
  DarkTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {CapturePage} from '../../pages/capture';
import {SettingsPage} from '../../pages/settings';
import {VaultStack} from './VaultStack';
import {colors} from '@/shared/config';
import type {RootTabParamList} from './types';

const Tab = createMaterialTopTabNavigator<RootTabParamList>();

const corporateDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.primary,
    notification: colors.accent,
  },
};

export function RootNavigator(): React.JSX.Element {
  return (
    <NavigationContainer theme={corporateDarkTheme}>
      <Tab.Navigator
        initialRouteName="Capture"
        tabBarPosition="bottom"
        screenOptions={({route}) => ({
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textDisabled,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIndicatorStyle: { height: 0 },
          tabBarShowIcon: true,
          tabBarItemStyle: styles.tabBarItem,
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color}) => (
            <Icon name={getTabIconName(route.name)} size={24} color={color} />
          ),
        })}>
        <Tab.Screen name="Capture" component={CapturePage} />
        <Tab.Screen name="VaultTab" component={VaultStack} options={{title: 'Vault'}} />
        <Tab.Screen name="Settings" component={SettingsPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function getTabIconName(routeName: keyof RootTabParamList): string {
  const icons: Record<keyof RootTabParamList, string> = {
    Capture: 'pencil-plus-outline',
    VaultTab: 'archive-outline',
    Settings: 'cog-outline',
  };

  return icons[routeName];
}

const styles = StyleSheet.create({
  tabBar: {
    height: 65,
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    elevation: 0,
  },
  tabBarItem: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'none',
    marginTop: 0,
  },
});
