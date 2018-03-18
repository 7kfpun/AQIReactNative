import {
  Platform,
} from 'react-native';

import { AdMobInterstitial } from 'react-native-admob';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import Details from './app/views/details';
import Forecast from './app/views/forecast';
import Help from './app/views/help';
import Mall from './app/views/mall';
import Main from './app/views/main';
import Settings from './app/views/settings';
import WeatherPhoto from './app/views/weather-photo';

import { config } from './app/config';

if (!__DEV__) {
  console.log = () => {};
}

AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);

const App = TabNavigator({
  Main: {
    screen: StackNavigator({
      MainMap: { screen: Main },
      MainDetails: { screen: Details },
      MainSettings: { screen: Help },
    }),
  },
  Forecast: { screen: Forecast },
  WeatherPhoto: { screen: WeatherPhoto },
  Settings: {
    screen: StackNavigator({
      SettingsSettings: { screen: Settings },
      SettingsHelp: { screen: Help },
    }),
  },
  Mall: { screen: Mall },
}, {
  headerMode: 'none',
  swipeEnabled: true,
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#29B6F6',
    inactiveTintColor: 'gray',
    // showIcon and pressColor are for Android
    showIcon: true,
    pressColor: '#E0E0E0',
    labelStyle: {
      fontSize: Platform.OS === 'ios' ? 10 : 8,
      paddingBottom: Platform.OS === 'ios' ? 3 : 0,
    },
    style: {
      backgroundColor: 'white',
      ...ifIphoneX({
        height: 80,
        paddingBottom: 25,
      }, {}),
    },
  },
});

console.ignoredYellowBox = [
  '[xmldom warning]',
  'Warning: setState(...): Can only update a mounted or mounting component.',
  'Setting a timer for a long period of time',
];

module.exports = App;
