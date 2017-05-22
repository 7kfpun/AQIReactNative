import {
  Platform,
} from 'react-native';

import { AdMobInterstitial } from 'react-native-admob';
import { StackNavigator } from 'react-navigation';

import Main from './app/views/main';
import Help from './app/views/help';
import Settings from './app/views/settings';

import { config } from './app/config';

AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);

const App = StackNavigator({
  Main: { screen: Main },
  Settings: { screen: Settings },
  Help: { screen: Help },
}, {
  mode: 'modal',
});

module.exports = App;
