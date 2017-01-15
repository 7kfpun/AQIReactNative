import React, { Component } from 'react';
import {
  Dimensions,
  Picker,
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

import { locations } from '../utils/locations';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 100,
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
});

export default class SettingsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      seconds: 5,
      notificationIsEnabled: false,
      notificationLocation: null,
      notificationTherhold: 100,
    };
  }

  componentDidMount() {
    const that = this;
    store.get('notificationIsEnabled').then(value => value && that.setState({ notificationIsEnabled: value }));
    store.get('notificationLocation').then((value) => {
      if (value) {
        that.setState({ notificationLocation: value });
      } else {
        store.save('notificationLocation', 'Central/Western');
      }
    });
    store.get('notificationTherhold').then((value) => {
      if (value) {
        that.setState({ notificationTherhold: value });
      } else {
        store.save('notificationTherhold', 100);
      }
    });
  }

  setNotification(value) {
    store.save('notificationIsEnabled', value);
    this.setState({ notificationIsEnabled: value });
  }

  setNotificationLocation(value) {
    store.save('notificationLocation', value);
    this.setState({ notificationLocation: value });
  }

  setNotificationTherhold(value) {
    store.save('notificationTherhold', value);
    this.setState({ notificationTherhold: value });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.close} onPress={Actions.pop} >
          <Icon name="close" size={30} color="gray" />
        </TouchableOpacity>
        <View style={styles.switchBlock}>
          <View style={{ flex: 6 }}>
            <Text style={styles.text}>Notify me when the air quality gets significantly worse</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Switch
              onValueChange={value => this.setNotification(value)}
              style={styles.switch}
              value={this.state.notificationIsEnabled}
            />
          </View>
        </View>

        {this.state.notificationIsEnabled && <View>
          <View style={styles.locationPickerTextBlock}>
            <Text style={styles.text}>Pick a location:</Text>
          </View>
          <Picker
            style={styles.picker}
            selectedValue={this.state.notificationLocation}
            onValueChange={value => this.setNotificationLocation(value)}
          >
            {locations.map((item, index) => <Picker.Item key={index} label={item.title} value={item.title} />)}
          </Picker>

          <View style={styles.locationPickerTextBlock}>
            <Text style={styles.text}>Notify me when AQI is above: {this.state.notificationTherhold}</Text>
          </View>
          <View style={styles.sliderBlock}>
            <Slider
              style={{ width: window.width - 60 }}
              step={1}
              value={this.state.notificationTherhold}
              minimumValue={0}
              maximumValue={500}
              onValueChange={value => this.setNotificationTherhold(value)}
            />
          </View>
        </View>}

      </View>
    );
  }
}
