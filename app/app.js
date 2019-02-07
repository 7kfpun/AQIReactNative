import React from 'react';
import {
  Platform,
  YellowBox,
} from 'react-native';

import { StackNavigator, TabNavigator } from 'react-navigation';
import { iOSColors } from 'react-native-typography';
import firebase from 'react-native-firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Details from './containers/main/details';
import Forecast from './containers/forecast';
import Help from './containers/help';
import Main from './containers/main';
import Mall from './containers/mall';
import Settings from './containers/settings';
import WeatherPhoto from './containers/weather-photo';

import tracker from './utils/tracker';

if (!__DEV__) {
  console.log = () => {};
}

if (__DEV__) {
  firebase.config().enableDeveloperMode();
}

const AppTab = TabNavigator({
  'map': {
    screen: StackNavigator(
      {
        map: { screen: Main },
        'map-details': { screen: Details },
        'map-help': { screen: Help },
      },
    ),
  },
  forecast: { screen: Forecast },
  'weather-photo': { screen: WeatherPhoto },
  'settings': {
    screen: StackNavigator(
      {
        settings: { screen: Settings },
        'settings-help': { screen: Help },
      },
    ),
  },
  mall: { screen: Mall },
}, {
    tabBarOptions: {
      activeTintColor: '#29B6F6',
      inactiveTintColor: 'gray',
      // showIcon and pressColor are for Android
      showIcon: true,
      pressColor: '#E0E0E0',
      labelStyle: {
        ...Platform.select({
          ios: {
            fontSize: 10,
            paddingBottom: 2,
            paddingTop: 2,
          },
          android: {
            fontSize: 6,
            paddingBottom: 0,
            paddingTop: 0,
          },
        }),
      },
      indicatorStyle: {
        backgroundColor: iOSColors.tealBlue,
      },
      style: {
        backgroundColor: 'white',
      },
    },
    tabBarPosition: 'bottom',

    navigationOptions: {
      headerStyle: {
        backgroundColor: iOSColors.tealBlue,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  });

YellowBox.ignoredYellowBox = [
  '[xmldom warning]',
  'Warning: Method `jumpToIndex` is deprecated.'
];

// gets the current screen from navigation state
function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

export default () => (
  <AppTab
    onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getCurrentRouteName(currentState);
      const prevScreen = getCurrentRouteName(prevState);

      console.log('prevScreen', prevScreen, 'currentScreen', currentScreen);
      if (prevScreen !== currentScreen) {
        tracker.view(currentScreen);
      }
    }}
  />
);
