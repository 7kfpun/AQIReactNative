import React, { Component } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OneSignal from 'react-native-onesignal';
import store from 'react-native-simple-store';

import SettingsItem from '../../components/settings-item';

import { locations } from '../../utils/locations';
import Admob from '../../components/admob';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const DEFAULT_POLLUTION_THERHOLD = 120;
const DEFAULT_CLEANLINESS_THERHOLD = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 10,
    backgroundColor: 'white',
  },
  titleBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  titleText: {
    color: 'black',
    fontSize: 24,
  },
  permissionReminderBlock: {
    backgroundColor: '#3949AB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  permissionReminderText: {
    fontSize: 12,
    color: 'white',
  },
  list: {
    paddingVertical: 20,
  },
});


function OneSignalGetTags() {
  return new Promise((resolve, reject) => {
    try {
      OneSignal.getTags(tags => resolve(tags));
    } catch (err) {
      reject(err);
    }
  });
}

export default class Settings extends Component {
  static navigationOptions = {
    header: null,
    title: 'Settings',
    tabBarLabel: I18n.t('settings'),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="notifications-none" size={21} color={tintColor || 'gray'} />
    ),
  };

  requestPermissions = () => {
    if (Platform.OS === 'ios') {
      const permissions = {
        alert: true,
        badge: true,
        sound: true,
      };
      OneSignal.requestPermissions(permissions);
      OneSignal.registerForPushNotifications();
    }
  }

  defaultSettings = (tags) => {
    if (Object.keys(tags).length) {
      store.get('isReturnUser', true);
      return true;
    }

    store.get('isReturnUser').then((isReturnUser) => {
      if (!isReturnUser) {
        const sendTags = {
          central: true,
          central_pollution_therhold: 140,
          central_cleanliness_therhold: 20,
        };
        console.log('Send first time user tags', sendTags);
        OneSignal.sendTags(sendTags);
        tracker.logEvent('send-first-time-user-tags', sendTags);
      }

      store.get('isReturnUser', true);
    });
  }

  state = {
    isShowPermissionReminderBlock: false,
  };

  async componentDidMount() {
    OneSignal.init(config.oneSignal, { kOSSettingsKeyAutoPrompt: true });

    const tags = await OneSignalGetTags();
    this.checkPermissions(tags);
    this.defaultSettings(tags);
    this.requestPermissions();
  }

  checkPermissions(tags) {
    if (Platform.OS === 'ios' && tags && Object.values(tags).indexOf('true') !== -1) {
      OneSignal.checkPermissions((permissions) => {
        console.log('checkPermissions', permissions);
        if (!permissions || (permissions && !permissions.alert)) {
          this.setState({ isShowPermissionReminderBlock: true });
        }
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{I18n.t('notify_title')}</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('settings-help')}>
            <Icon name="help-outline" size={30} color="gray" />
          </TouchableOpacity>
        </View>

        {this.state.isShowPermissionReminderBlock &&
          <View style={styles.permissionReminderBlock}>
            <Text style={styles.permissionReminderText}>{I18n.t('permissions_required')}</Text>
          </View>}
        <ScrollView>
          <FlatList
            style={styles.list}
            data={locations}
            keyExtractor={(item, index) => `${index}-${item.key}`}
            renderItem={({ item }) => <View style={{ padding: 10 }}><SettingsItem item={item} /></View>}
          />
        </ScrollView>

        <Admob unitId={`hkaqi-settings-${Platform.OS}-footer`} />
      </SafeAreaView>
    );
  }
}
