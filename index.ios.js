/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
  AppRegistry,
} from 'react-native';

import { Actions, Router, Scene } from 'react-native-router-flux';

import Main from './app/views/main';
import Help from './app/views/help';

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="main" title={'Main'} component={Main} hideNavBar={true} initial={true} />
    <Scene key="help" title={'Help'} component={Help} hideNavBar={true} direction="vertical" />
  </Scene>,
);

const AQI = function Photos() {
  return <Router scenes={scenes} />;
};

AppRegistry.registerComponent('AQI', () => AQI);
