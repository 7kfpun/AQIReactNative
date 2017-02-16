import React, { Component } from 'react';
import {
  Platform,
} from 'react-native';

import { Actions, Router, Scene } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import store from 'react-native-simple-store';

import Main from './app/views/main';
import Help from './app/views/help';
import Settings from './app/views/settings';

import aqi from './app/utils/aqi';
import { config } from './app/config';

AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="main" title={'Main'} component={Main} hideNavBar={true} initial={true} />
    <Scene key="help" title={'Help'} component={Help} hideNavBar={true} direction="vertical" />
    <Scene key="settings" title={'Settings'} component={Settings} hideNavBar={true} direction="vertical" />
  </Scene>,
);

export default class App extends Component {
  componentDidMount() {
    if (Platform.OS === 'ios') {
      BackgroundFetch.configure({
        stopOnTerminate: false,
      }, () => {
        console.log('[js] Received background-fetch event');

        store.get('notificationIsEnabled')
          .then((notificationIsEnabled) => {
            if (notificationIsEnabled) {
              store.get('notificationLocation')
                .then((notificationLocation) => {
                  if (notificationLocation) {
                    store.get('notificationTherhold')
                      .then((notificationTherhold) => {
                        if (notificationTherhold) {
                          aqi().then((result) => {
                            if (result
                              && result[notificationLocation]
                              && !isNaN(result[notificationLocation].AQI)
                              && parseInt(result[notificationLocation].AQI) > notificationTherhold
                            ) {
                              const date = new Date(Date.now() + (1000));
                              PushNotification.localNotificationSchedule({
                                message: `AQI in ${notificationLocation} is high now: ${result[notificationLocation].AQI}`,
                                date,
                              });
                              console.log('BackgroundFetch', notificationIsEnabled, notificationLocation, notificationTherhold);
                            } else {
                              console.log('BackgroundFetch does not match.');
                            }
                          });
                        }
                      });
                  }
                });
            }
          });

        // To signal completion of your task to iOS, you must call #finish!
        // If you fail to do this, iOS can kill your app.
        BackgroundFetch.finish();
      }, (error) => {
        console.log('[js] RNBackgroundFetch failed to start', error);
      });
    }

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log('BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log('BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('BackgroundFetch is enabled');
          break;
        default:
          break;
      }
    });
  }

  render() {
    return <Router scenes={scenes} />;
  }
}
