import React, { Component } from 'react';
import {
  Dimensions,
  Picker,
  Platform,
  ScrollView,
  Slider,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Fabric from 'react-native-fabric';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OneSignal from 'react-native-onesignal';
import store from 'react-native-simple-store';
import Toast from 'react-native-root-toast';

import { locations } from '../utils/locations';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const { Answers } = Fabric;

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 25,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
  },
  locationPickerTextBlock: {
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  switchBlock: {
    flexDirection: 'row',
    paddingTop: 60,
    marginHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  picker: {
    width: 400,
  },
  sliderBlock: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticeTextBlock: {
    paddingHorizontal: 30,
  },
  noticeText: {
    fontSize: 12,
  },
});

function toastShow() {
  OneSignal.checkPermissions((permissions) => {
    if (!permissions.alert && !permissions.badge && !permissions.sound) {
      Toast.show(I18n.t('permissions_required'), { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM - 40 });
    }
  });
}

export default class SettingsView extends Component {
  static navigationOptions = {
    header: null,
    title: 'Settings',
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

  state = {
    seconds: 5,
    notificationPollutionIsEnabled: false,
    notificationPollutionLocation: 'Central/Western',
    notificationPollutionTherhold: 100,
    notificationCleanlinessIsEnabled: false,
    notificationCleanlinessLocation: 'Central/Western',
    notificationCleanlinessTherhold: 40,
  };

  componentDidMount() {
    SettingsView.checkPermissions();

    const that = this;
    store.get('notificationPollutionIsEnabled').then(value => value && that.setState({ notificationPollutionIsEnabled: value }));
    store.get('notificationPollutionLocation').then((value) => {
      if (value) {
        that.setState({ notificationPollutionLocation: value });
      } else {
        store.save('notificationPollutionLocation', 'Central/Western');
      }
    });
    store.get('notificationPollutionTherhold').then((value) => {
      if (value) {
        that.setState({ notificationPollutionTherhold: value });
      } else {
        store.save('notificationPollutionTherhold', 100);
      }
    });

    store.get('notificationCleanlinessIsEnabled').then(value => value && that.setState({ notificationCleanlinessIsEnabled: value }));
    store.get('notificationCleanlinessLocation').then((value) => {
      if (value) {
        that.setState({ notificationCleanlinessLocation: value });
      } else {
        store.save('notificationCleanlinessLocation', 'Central/Western');
      }
    });
    store.get('notificationCleanlinessTherhold').then((value) => {
      if (value) {
        that.setState({ notificationCleanlinessTherhold: value });
      } else {
        store.save('notificationCleanlinessTherhold', 40);
      }
    });

    this.sendTags();
  }

  setNotificationPollution(value) {
    store.save('notificationPollutionIsEnabled', value);
    this.setState({ notificationPollutionIsEnabled: value });
    if (value) {
      tracker.trackEvent('user-action', 'set-notification-pollution', { label: 'notification-pollution-on' });
      Answers.logCustom('set-notification-pollution', { event: 'notification-pollution-on' });

      if (Platform.OS === 'ios') {
        permissions = {
          alert: true,
          badge: true,
          sound: true,
        };
        OneSignal.requestPermissions(permissions);
        OneSignal.registerForPushNotifications();
      }
    } else {
      tracker.trackEvent('user-action', 'set-notification-pollution', { label: 'notification-pollution-off' });
      Answers.logCustom('set-notification-pollution', { event: 'notification-pollution-off' });
    }

    this.sendTags();
  }

  setNotificationPollutionLocation(value) {
    store.save('notificationPollutionLocation', value);
    this.setState({ notificationPollutionLocation: value });

    this.sendTags();
  }

  setNotificationPollutionTherhold(value) {
    store.save('notificationPollutionTherhold', value);
    this.setState({ notificationPollutionTherhold: value });
  }

  setNotificationCleanliness(value) {
    store.save('notificationCleanlinessIsEnabled', value);
    this.setState({ notificationCleanlinessIsEnabled: value });
    if (value) {
      tracker.trackEvent('user-action', 'set-notification-cleanliness', { label: 'notification-cleanliness-on' });
      Answers.logCustom('set-notification-cleanliness', { event: 'notification-cleanliness-on' });
      if (Platform.OS === 'ios') {
        permissions = {
          alert: true,
          badge: true,
          sound: true,
        };
        OneSignal.requestPermissions(permissions);
        OneSignal.registerForPushNotifications();
      }
    } else {
      tracker.trackEvent('user-action', 'set-notification-cleanliness', { label: 'notification-cleanliness-off' });
      Answers.logCustom('set-notification-cleanliness', { event: 'notification-cleanliness-off' });
    }

    this.sendTags();
  }

  setNotificationCleanlinessLocation(value) {
    store.save('notificationCleanlinessLocation', value);
    this.setState({ notificationCleanlinessLocation: value });

    this.sendTags();
  }

  setNotificationCleanlinessTherhold(value) {
    store.save('notificationCleanlinessTherhold', value);
    this.setState({ notificationCleanlinessTherhold: value });
  }

  sendTags() {
    if (this.state.notificationPollutionIsEnabled) {
      OneSignal.sendTags({
        pollutionIsEnabled: 'true',
        pollutionLocation: this.state.notificationPollutionLocation,
        pollutionTherhold: this.state.notificationPollutionTherhold,
      });
    } else {
      OneSignal.sendTags({
        pollutionIsEnabled: 'false',
      });
    }

    if (this.state.notificationCleanlinessIsEnabled) {
      OneSignal.sendTags({
        cleanlinessIsEnabled: 'true',
        cleanlinessLocation: this.state.notificationCleanlinessLocation,
        cleanlinessTherhold: this.state.notificationCleanlinessTherhold,
      });
    } else {
      OneSignal.sendTags({
        cleanlinessIsEnabled: 'false',
      });
    }
  }

  popSettings() {
    SettingsView.checkPermissions();
    this.sendTags();
  }

  render() {
    const { goBack } = this.props.navigation;
    tracker.trackScreenView('Settings');
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.switchBlock}>
            <View style={{ flex: 6 }}>
              <Text style={styles.text}>{I18n.t('notify_pollution_title')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Switch
                onValueChange={value => this.setNotificationPollution(value)}
                style={styles.switch}
                value={this.state.notificationPollutionIsEnabled}
              />
            </View>
          </View>

          {this.state.notificationPollutionIsEnabled && <View>
            <View style={styles.locationPickerTextBlock}>
              <Text style={styles.text}>{I18n.t('notify_pollution_location')}:</Text>
            </View>
            <Picker
              style={styles.picker}
              selectedValue={this.state.notificationPollutionLocation}
              onValueChange={value => this.setNotificationPollutionLocation(value)}
            >
              {locations.map(item => <Picker.Item key={`0-${item.title}`} label={item.title} value={item.title} />)}
            </Picker>

            <View style={styles.locationPickerTextBlock}>
              <Text style={styles.text}>{I18n.t('notify_pollution_therhold')}: {this.state.notificationPollutionTherhold}</Text>
            </View>
            <View style={styles.sliderBlock}>
              <Slider
                style={{ width: window.width - 60 }}
                step={1}
                value={this.state.notificationPollutionTherhold}
                minimumValue={0}
                maximumValue={500}
                onValueChange={value => this.setNotificationPollutionTherhold(value)}
              />
            </View>
            {this.state.notificationPollutionTherhold < 100 && <View style={styles.noticeTextBlock}>
              <Text style={styles.noticeText}>{I18n.t('too_small_therhold')}</Text>
            </View>}
          </View>}

          <View style={styles.switchBlock}>
            <View style={{ flex: 6 }}>
              <Text style={styles.text}>{I18n.t('notify_cleanliness_title')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Switch
                onValueChange={value => this.setNotificationCleanliness(value)}
                style={styles.switch}
                value={this.state.notificationCleanlinessIsEnabled}
              />
            </View>
          </View>

          {this.state.notificationCleanlinessIsEnabled && <View style={{ marginBottom: 60 }}>
            <View style={styles.locationPickerTextBlock}>
              <Text style={styles.text}>{I18n.t('notify_cleanliness_location')}:</Text>
            </View>
            <Picker
              style={styles.picker}
              selectedValue={this.state.notificationCleanlinessLocation}
              onValueChange={value => this.setNotificationCleanlinessLocation(value)}
            >
              {locations.map(item => <Picker.Item key={`1-${item.title}`} label={item.title} value={item.title} />)}
            </Picker>

            <View style={styles.locationPickerTextBlock}>
              <Text style={styles.text}>{I18n.t('notify_cleanliness_therhold')}: {this.state.notificationCleanlinessTherhold}</Text>
            </View>
            <View style={styles.sliderBlock}>
              <Slider
                style={{ width: window.width - 60 }}
                step={1}
                value={this.state.notificationCleanlinessTherhold}
                minimumValue={0}
                maximumValue={500}
                onValueChange={value => this.setNotificationCleanlinessTherhold(value)}
              />
            </View>
            {this.state.notificationCleanlinessTherhold > 40 && <View style={styles.noticeTextBlock}>
              <Text style={styles.noticeText}>{I18n.t('too_large_therhold')}</Text>
            </View>}
          </View>}
        </ScrollView>

        <TouchableOpacity style={styles.close} onPress={() => { this.popSettings(); goBack(); }} >
          <Icon name="close" size={30} color="gray" />
        </TouchableOpacity>
      </View>
    );
  }
}

SettingsView.propTypes = {
  navigation: React.PropTypes.shape({
    goBack: React.PropTypes.func.isRequired,
  }).isRequired,
};
