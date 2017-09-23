import React, { Component } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import OneSignal from 'react-native-onesignal';
import store from 'react-native-simple-store';
import Toast from 'react-native-root-toast';

import { locations } from '../utils/locations';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';
import SettingsItem from '../elements/settings-item';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    paddingTop: 60,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  text: {
    fontSize: 24,
  },
});

function toastShow() {
  OneSignal.checkPermissions((permissions) => {
    console.log('OneSignal permissions', permissions);
    if (!permissions.alert && !permissions.badge && !permissions.sound) {
      Toast.show(I18n.t('permissions_required'), { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM - 40 });
    }
  });
}

export default class SettingsView extends Component {
  static navigationOptions = {
    header: null,
    title: 'Settings',
    tabBarLabel: I18n.t('settings'),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="notifications-none" size={21} color={tintColor || 'gray'} />
    ),
  };

  static checkPermissions() {
    if (Platform.OS === 'ios') {
      store.get('notificationPollutionIsEnabled').then((notificationPollutionIsEnabled) => {
        if (notificationPollutionIsEnabled) {
          toastShow();
        } else {
          store.get('notificationCleanlinessIsEnabled').then((notificationCleanlinessIsEnabled) => {
            if (notificationCleanlinessIsEnabled) {
              toastShow();
            }
          });
        }
      });
    }
  }

  state = {};

  componentDidMount() {
    SettingsView.checkPermissions();

    OneSignal.getTags((receivedTags) => {
      console.log('OneSignal tags', receivedTags);
      const {
        pollutionIsEnabled,
        pollutionLocation,
        pollutionTherhold,
        cleanlinessIsEnabled,
        cleanlinessLocation,
        cleanlinessTherhold,
      } = receivedTags;

      const tags = {};

      if (pollutionIsEnabled === 'true' && pollutionLocation) {
        const valueLocation = pollutionLocation.replace('/', '_').replace(' ', '_').toLowerCase();
        tags[valueLocation] = true;
        tags[`${valueLocation}_pollution_therhold`] = pollutionTherhold || 100;
      }

      if (cleanlinessIsEnabled === 'true' && cleanlinessLocation) {
        const valueLocation = cleanlinessLocation.replace('/', '_').replace(' ', '_').toLowerCase();
        tags[valueLocation] = true;
        tags[`${valueLocation}_pollution_therhold`] = cleanlinessTherhold || 40;
      }

      console.log('Send tags', tags);
      OneSignal.sendTags(tags);
      OneSignal.deleteTag('pollutionIsEnabled');
      OneSignal.deleteTag('pollutionLocation');
      OneSignal.deleteTag('pollutionTherhold');
      OneSignal.deleteTag('cleanlinessIsEnabled');
      OneSignal.deleteTag('cleanlinessLocation');
      OneSignal.deleteTag('cleanlinessTherhold');
    });
  }

  popSettings() {
    SettingsView.checkPermissions();
  }

  render() {
    tracker.trackScreenView('Settings');
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.text}>{I18n.t('notify_title')}</Text>
        </View>
        <ScrollView>
          <FlatList
            style={{ paddingVertical: 20 }}
            data={locations}
            keyExtractor={(item, index) => `${index}-${item.key}`}
            renderItem={({ item }) => <SettingsItem item={item} />}
          />
        </ScrollView>
      </View>
    );
  }
}
