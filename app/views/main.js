import React, { Component } from 'react';
import {
  ScrollView,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';
import { RNLocation as Location } from 'NativeModules';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import timer from 'react-native-timer';
import Toast from 'react-native-root-toast';

import Marker from '../elements/marker';
import AdMob from '../elements/admob';
import aqi from '../utils/aqi';

import { locations } from '../utils/locations';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  menu: {
    position: 'absolute',
    left: 15,
    top: 25,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 42,
    borderRadius: 21,
  },
  help: {
    position: 'absolute',
    right: 15,
    top: 25,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 42,
    borderRadius: 21,
  },
  infomationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  infomationBubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 2,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 56,
    paddingHorizontal: 2,
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default class MainView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: {
        latitude: 22.3218,
        longitude: 114.1795,
      },
      markers: locations,
      selectedIndex: 'AQI',
      toastVisible: false,
      modalVisible: false,
      gpsEnabled: false,
    };
  }

  componentWillMount() {
    Location.requestWhenInUseAuthorization();
    // Location.requestAlwaysAuthorization();
    Location.startUpdatingLocation();
    Location.setDistanceFilter(5.0);
    DeviceEventEmitter.addListener('locationUpdated', (location) => {
      console.log('Location update', location);
      this.setState({
        location: location.coords,
        gpsEnabled: true,
      });
    });
  }

  componentDidMount() {
    this.prepareData();

    timer.clearTimeout(this);
    timer.setTimeout(this, 'AdMobInterstitial', () => {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error => error && console.log(error)));
    }, 10 * 1000);
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  prepareData() {
    this.setState({ toastVisible: true });
    aqi().then((result) => {
      this.setState({
        aqiResult: result,
        toastVisible: false,
      });
    });
  }

  render() {
    tracker.trackScreenView('Main');
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: this.state.location.latitude,
            longitude: this.state.location.longitude,
            latitudeDelta: this.state.gpsEnabled ? 0.1 : 0.0032,
            longitudeDelta: this.state.gpsEnabled ? 0.1 : 0.221,
          }}
        >
          {/* <TouchableOpacity style={styles.menu} onPress={Actions.settings}>
            <Icon name="settings" size={30} color="#616161" />
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.help} onPress={Actions.help} >
            <Icon name="help-outline" size={30} color="#616161" />
          </TouchableOpacity>
          {this.state.aqiResult && this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.latlng.latitude}
              coordinate={marker.latlng}
              title={`${this.state.selectedIndex} is ${this.state.aqiResult[marker.title][this.state.selectedIndex]} in ${marker.title}`}
              description={marker.description}
            >
              {this.state.aqiResult[marker.title]
                // && this.state.aqiResult[marker.title][this.state.selectedIndex] !== '-*'
                // && this.state.aqiResult[marker.title][this.state.selectedIndex] !== '/-'
                // && this.state.aqiResult[marker.title][this.state.selectedIndex] !== '-/-'
                && <Marker amount={this.state.aqiResult[marker.title][this.state.selectedIndex]} index={this.state.selectedIndex} />}
            </MapView.Marker>
          ))}

          {this.state.location && <MapView.Marker
            coordinate={this.state.location}
          />}

          {this.state.aqiResult && <View style={styles.infomationContainer}>
            <TouchableOpacity
              onPress={() => {
                this.prepareData();
                tracker.trackEvent('user-action', 'fetch-latest-data');
              }}
              style={styles.infomationBubble}
            >
              <Text>Update on {this.state.aqiResult.time}</Text>
            </TouchableOpacity>
          </View>}

          <View style={styles.buttonContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>

              {['AQI', 'AQHI', 'NO2', 'O3', 'SO2', 'CO', 'PM10', 'PM2.5'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    this.setState({ selectedIndex: item });
                    tracker.trackEvent('user-action', 'select-index', { label: item });
                  }}
                  style={[styles.bubble, styles.button]}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <Toast
            visible={this.state.toastVisible}
            position={Toast.positions.BOTTOM - 120}
          >{'Fetching...'}</Toast>
        </MapView>

        <AdMob />
      </View>
    );
  }
}
