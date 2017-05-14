import React from 'react';
import {
  Platform,
} from 'react-native';

import { Actions, Router, Scene } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';

import Main from './app/views/main';
import Help from './app/views/help';
import Settings from './app/views/settings';

import { config } from './app/config';

AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="main" title={'Main'} component={Main} hideNavBar={true} initial={true} />
    <Scene key="help" title={'Help'} component={Help} hideNavBar={true} direction="vertical" />
    <Scene key="settings" title={'Settings'} component={Settings} hideNavBar={true} direction="vertical" />
  </Scene>,
);

function App() {
  return (
    <Router scenes={scenes} />
  );
}

module.exports = App;
