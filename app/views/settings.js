import React, { Component } from 'react';
import {
  Dimensions,
  Picker,
  ScrollView,
  Slider,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import store from 'react-native-simple-store';
import OneSignal from 'react-native-onesignal';

import { locations } from '../utils/locations';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

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
    paddingBottom: 30,
  },
});

export default class SettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seconds: 5,
      notificationPollutionIsEnabled: false,
      notificationPollutionLocation: null,
      notificationPollutionTherhold: 100,
      notificationCleanlinessIsEnabled: false,
      notificationCleanlinessLocation: null,
      notificationCleanlinessTherhold: 40,
    };
  }

  componentDidMount() {
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
        store.save('notificationCleanlinessTherhold', 100);
      }
    });

    this.sendTags();
  }

  setNotificationPollution(value) {
    store.save('notificationPollutionIsEnabled', value);
    this.setState({ notificationPollutionIsEnabled: value });
    if (value) {
      tracker.trackEvent('user-action', 'set-notification-pollution', { label: 'notification-pollution-on' });
      permissions = {
        alert: true,
        badge: true,
        sound: true,
      };
      OneSignal.requestPermissions(permissions);
      OneSignal.registerForPushNotifications();
    } else {
      tracker.trackEvent('user-action', 'set-notification-pollution', { label: 'notification-pollution-off' });
    }
  }

  setNotificationPollutionLocation(value) {
    store.save('notificationPollutionLocation', value);
    this.setState({ notificationPollutionLocation: value });
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
      permissions = {
        alert: true,
        badge: true,
        sound: true,
      };
      OneSignal.requestPermissions(permissions);
      OneSignal.registerForPushNotifications();
    } else {
      tracker.trackEvent('user-action', 'set-notification-cleanliness', { label: 'notification-cleanliness-off' });
    }
  }

  setNotificationCleanlinessLocation(value) {
    store.save('notificationCleanlinessLocation', value);
    this.setState({ notificationCleanlinessLocation: value });
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

  render() {
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
              {locations.map((item, index) => <Picker.Item key={index} label={item.title} value={item.title} />)}
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

          {this.state.notificationCleanlinessIsEnabled && <View>
            <View style={styles.locationPickerTextBlock}>
              <Text style={styles.text}>{I18n.t('notify_cleanliness_location')}:</Text>
            </View>
            <Picker
              style={styles.picker}
              selectedValue={this.state.notificationCleanlinessLocation}
              onValueChange={value => this.setNotificationCleanlinessLocation(value)}
            >
              {locations.map((item, index) => <Picker.Item key={index} label={item.title} value={item.title} />)}
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
          </View>}
        </ScrollView>

        <TouchableOpacity style={styles.close} onPress={() => { Actions.pop(); this.sendTags(); }} >
          <Icon name="close" size={30} color="gray" />
        </TouchableOpacity>
      </View>
    );
  }
}
