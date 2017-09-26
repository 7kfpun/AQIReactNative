import {
  Platform,
} from 'react-native';

import { AdMobInterstitial } from 'react-native-admob';
import { TabNavigator } from 'react-navigation';

import Forecast from './app/views/forecast';
import Help from './app/views/help';
import Main from './app/views/main';
import Settings from './app/views/settings';

import { config } from './app/config';

if (!__DEV__) {
  console.log = () => {};
}

AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);

const App = TabNavigator({
  Main: { screen: Main },
  Forecast: { screen: Forecast },
  Settings: { screen: Settings },
  Help: { screen: Help },
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
      fontSize: Platform.OS === 'ios' ? 12 : 8,
      paddingBottom: Platform.OS === 'ios' ? 4 : 0,
    },
    style: {
      backgroundColor: 'white',
    },
  },
});

console.ignoredYellowBox = [
  '[xmldom warning]',
  'Warning: setState(...): Can only update a mounted or mounting component.',
  'Setting a timer for a long period of time',
];

module.exports = App;
