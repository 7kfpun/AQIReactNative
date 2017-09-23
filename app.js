import {
  Platform,
} from 'react-native';

import { AdMobInterstitial } from 'react-native-admob';
import { TabNavigator } from 'react-navigation';

import Main from './app/views/main';
import Help from './app/views/help';
import Settings from './app/views/settings';

import { config } from './app/config';

if (!__DEV__) {
  console.log = () => {};
}

AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);

const App = TabNavigator({
  Main: { screen: Main },
  Settings: { screen: Settings },
  Help: { screen: Help },
}, {
  headerMode: 'none',
  swipeEnabled: true,
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#29B6F6',
    labelStyle: {
      fontSize: 12,
      paddingBottom: 3,
    },
    style: {
      backgroundColor: 'white',
    },
  },
});

console.ignoredYellowBox = [
  '[xmldom warning]',
  'Warning: setState(...): Can only update a mounted or mounting component.',
];

module.exports = App;
