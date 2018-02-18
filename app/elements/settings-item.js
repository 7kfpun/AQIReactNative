import React, { Component } from 'react';
import {
  Platform,
  Slider,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import OneSignal from 'react-native-onesignal';
import ReactNativeI18n from 'react-native-i18n';

import { getColor } from '../utils/indexes';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const deviceLocale = ReactNativeI18n.locale;
const DEFAULT_POLLUTION_THERHOLD = 120;
const DEFAULT_CLEANLINESS_THERHOLD = 40;

const styles = StyleSheet.create({
  container: {},
  switchBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
  },
  noticeText: {
    fontSize: 12,
  },
  noticeWarningText: {
    fontSize: 10,
    marginBottom: 15,
  },
});

export default class SettingsItem extends Component {
  state = {
    isEnabled: false,
    pollutionTherhold: DEFAULT_POLLUTION_THERHOLD,
    cleanlinessTherhold: DEFAULT_CLEANLINESS_THERHOLD,
  };

  componentDidMount() {
    const that = this;
    OneSignal.getTags((receivedTags) => {
      console.log(receivedTags);
      const tags = receivedTags || {};
      const { item } = this.props;

      that.setState({
        isEnabled: tags[item.key] === 'true',
        pollutionTherhold: tags[`${item.key}_pollution_therhold`] ? parseInt(tags[`${item.key}_pollution_therhold`], 10) : DEFAULT_POLLUTION_THERHOLD,
        cleanlinessTherhold: tags[`${item.key}_cleanliness_therhold`] ? parseInt(tags[`${item.key}_cleanliness_therhold`], 10) : DEFAULT_CLEANLINESS_THERHOLD,
      });
    });
  }

  setNotification(value) {
    this.setState({ isEnabled: value }, () => {
      this.sendTags();
    });

    if (value && Platform.OS === 'ios') {
      permissions = {
        alert: true,
        badge: true,
        sound: true,
      };
      OneSignal.requestPermissions(permissions);
      OneSignal.registerForPushNotifications();
    }

    const { item } = this.props;
    tracker.logEvent('set-notification-pollution', {
      label: value ? 'notification-pollution-on' : 'notification-pollution-off',
      location: item.key,
      pollution_therhold: this.state.pollutionTherhold,
      cleanliness_therhold: this.state.cleanlinessTherhold,
    });
  }

  setNotificationPollutionTherhold(value) {
    this.setState({ pollutionTherhold: value }, () => {
      this.sendTags();
    });
  }

  setNotificationCleanlinessTherhold(value) {
    this.setState({ cleanlinessTherhold: value }, () => {
      this.sendTags();
    });
  }

  sendTags() {
    const { item } = this.props;

    const tags = {};
    tags[item.key] = this.state.isEnabled;
    tags[`${item.key}_pollution_therhold`] = this.state.isEnabled ? this.state.pollutionTherhold : false;
    tags[`${item.key}_cleanliness_therhold`] = this.state.isEnabled ? this.state.cleanlinessTherhold : false;

    console.log('Send tags', tags);
    OneSignal.sendTags(tags);
  }

  render() {
    const { item, text } = this.props;
    let itemTitle;

    if (text) {
      itemTitle = text;
    } else if (deviceLocale.startsWith('zh-Hans')) {
      itemTitle = item.title_hans;
    } else if (deviceLocale.startsWith('zh')) {
      itemTitle = item.title_hant;
    } else {
      itemTitle = item.title;
    }

    return (
      <View style={styles.container}>
        <View style={styles.switchBlock}>
          <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Text style={styles.text}>{itemTitle}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Switch
              onValueChange={value => this.setNotification(value)}
              value={this.state.isEnabled}
              tintColor="#EEEEEE"
            />
          </View>
        </View>
        {this.state.isEnabled &&
          <View style={{ marginTop: 8 }}>
            <Text style={styles.noticeText}>{I18n.t('notify_pollution_therhold')}: {this.state.pollutionTherhold}</Text>
            <Slider
              style={{ width: window.width - 20 }}
              step={1}
              value={this.state.pollutionTherhold}
              minimumValue={1}
              maximumValue={500}
              onValueChange={value => this.setNotificationPollutionTherhold(value)}
              minimumTrackTintColor={getColor('AQI', parseFloat(this.state.pollutionTherhold)).color || 'grey'}
            />
            {this.state.pollutionTherhold < 100 && <Text style={styles.noticeWarningText}>{I18n.t('too_small_therhold')}</Text>}

            <Text style={styles.noticeText}>{I18n.t('notify_cleanliness_therhold')}: {this.state.cleanlinessTherhold}</Text>
            <Slider
              style={{ width: window.width - 20 }}
              step={1}
              value={this.state.cleanlinessTherhold}
              minimumValue={1}
              maximumValue={500}
              onValueChange={value => this.setNotificationCleanlinessTherhold(value)}
              minimumTrackTintColor={getColor('AQI', parseFloat(this.state.cleanlinessTherhold)).color || 'grey'}
            />
            {this.state.cleanlinessTherhold > 40 && <Text style={styles.noticeWarningText}>{I18n.t('too_large_therhold')}</Text>}
          </View>}
      </View>
    );
  }
}

SettingsItem.propTypes = {
};
SettingsItem.defaultProps = {
};
