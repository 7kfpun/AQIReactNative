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
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 25,
    backgroundColor: 'transparent',
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
    const { goBack } = this.props.navigation;
    tracker.trackScreenView('Settings');
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ paddingTop: 60, paddingLeft: 10 }}>
            <Text style={styles.text}>{I18n.t('notify_title')}</Text>
          </View>
          <FlatList
            style={{ paddingVertical: 30 }}
            data={locations}
            keyExtractor={(item, index) => `${index}-${item.key}`}
            renderItem={({ item }) => <SettingsItem item={item} />}
          />

          {/* <View style={styles.switchBlock}>
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
          </View>} */}
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
