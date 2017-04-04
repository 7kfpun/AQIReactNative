import React, { Component } from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { RNLocation as Location } from 'NativeModules';  // eslint-disable-line
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import ReactNativeI18n from 'react-native-i18n';
import RNALocation from 'react-native-android-location';
import timer from 'react-native-timer';

import AdBanner from '../elements/ad-banner';
import aqi from '../utils/aqi';
import I18n from '../utils/i18n';
import Marker from '../elements/marker';
import Rating from '../elements/rating';

import { locations } from '../utils/locations';
import tracker from '../utils/tracker';

const { width, height } = Dimensions.get('window');
const deviceLocale = ReactNativeI18n.locale;

const ASPECT_RATIO = width / height;
const LATITUDE = 22.3218;
const LONGITUDE = 114.1795;
const LATITUDE_DELTA = 0.3;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const FIVE_MINUTES = 5 * 60 * 1000;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 50,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  menu: {
    position: 'absolute',
    left: 15,
    top: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  help: {
    position: 'absolute',
    right: 15,
    top: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  currentLocation: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    width: 46,
    borderRadius: 23,
  },
  infomationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  infomationBubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  infomationBubbleBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infomationBubbleText: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
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
  text: {
    fontSize: 12,
  },
});

export default class MainView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
      markers: locations,
      selectedIndex: 'AQI',
      isLoading: false,
      gpsEnabled: false,
    };
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
      Location.requestWhenInUseAuthorization();
      // Location.requestAlwaysAuthorization();
      Location.startUpdatingLocation();
      Location.setDistanceFilter(5.0);
      DeviceEventEmitter.addListener('locationUpdated', (location) => {
        console.log('Location updated', location);
        this.setState({
          location: location.coords,
          gpsEnabled: true,
        });
      });
    } else {
      DeviceEventEmitter.addListener('updateLocation', (location) => {
        console.log('Location updated', location);
        this.setState({
          location: {
            longitude: location.Longitude,
            latitude: location.Latitude,
          },
          gpsEnabled: true,
        });
      });

      // Initialize RNALocation
      RNALocation.getLocation();
    }
  }

  componentDidMount() {
    this.prepareData();

    timer.setInterval(this, 'ReloadDataInterval', () => this.prepareData(), FIVE_MINUTES);
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
    timer.clearInterval(this);
  }

  getCurrentLocation() {
    return {
      latitude: this.state.location.latitude,
      longitude: this.state.location.longitude,
      latitudeDelta: this.state.gpsEnabled ? 0.15 : LATITUDE_DELTA,
      longitudeDelta: this.state.gpsEnabled ? 0.15 * ASPECT_RATIO : LONGITUDE_DELTA,
    };
  }

  prepareData() {
    this.setState({ isLoading: true });
    aqi().then((result) => {
      this.setState({
        aqiResult: result,
        isLoading: false,
      });
    });
  }

  render() {
    tracker.trackScreenView('Main');
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            ref={(ref) => { this.map = ref; }}
            initialRegion={this.getCurrentLocation()}
          >
            {this.state.aqiResult && this.state.markers.map(marker => (
              <MapView.Marker
                key={marker.latlng.latitude}
                coordinate={marker.latlng}
                title={
                  deviceLocale.startsWith('zh-Hans') ?
                  `${marker.title} 地区 ${this.state.selectedIndex} 值为 ${this.state.aqiResult[marker.title][this.state.selectedIndex]}`
                  : deviceLocale.startsWith('zh') ?
                    `${marker.title} 地区 ${this.state.selectedIndex} 值為 ${this.state.aqiResult[marker.title][this.state.selectedIndex]}`
                    :
                    `${this.state.selectedIndex} is ${this.state.aqiResult[marker.title][this.state.selectedIndex]} in ${marker.title}`
                }
                description={marker.description}
              >
                {this.state.aqiResult[marker.title]
                  && <Marker amount={this.state.aqiResult[marker.title][this.state.selectedIndex]} index={this.state.selectedIndex} />}
              </MapView.Marker>
            ))}

            {this.state.gpsEnabled && this.state.location && <MapView.Marker
              coordinate={this.state.location}
            />}
          </MapView>

          <TouchableOpacity style={styles.menu} onPress={Actions.settings}>
            <Animatable.View animation="tada" delay={2000} iterationCount={20}>
              <Icon name="notifications-active" size={26} color="#616161" />
            </Animatable.View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.help} onPress={Actions.help} >
            <Icon name="help-outline" size={26} color="#616161" />
          </TouchableOpacity>

          {this.state.gpsEnabled && <TouchableOpacity
            style={styles.currentLocation}
            onPress={() => {
              this.map.animateToRegion(this.getCurrentLocation());
              tracker.trackEvent('user-action', 'move-to-current-location');
            }}
          >
            <Icon name="near-me" size={26} color="#616161" />
          </TouchableOpacity>}

          <Rating />

          {this.state.aqiResult && <View style={styles.infomationContainer}>
            <TouchableOpacity
              onPress={() => {
                this.prepareData();
                tracker.trackEvent('user-action', 'fetch-latest-data');
              }}
              style={styles.infomationBubble}
            >
              <View style={styles.infomationBubbleBody}>
                <Text style={styles.infomationBubbleText}>{I18n.t('last_update')} {this.state.aqiResult.time}</Text>
                {!this.state.isLoading && <Icon name="refresh" style={{ marginLeft: 5 }} size={20} color="#616161" />}
                {this.state.isLoading && <ActivityIndicator style={{ marginLeft: 5 }} />}
              </View>
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
                  <Text style={styles.text}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        <AdBanner />
      </View>
    );
  }
}
