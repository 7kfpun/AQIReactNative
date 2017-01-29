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
import { AdMobInterstitial } from 'react-native-admob';
import { RNLocation as Location } from 'NativeModules';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import RNALocation from 'react-native-android-location';
import timer from 'react-native-timer';

import Marker from '../elements/marker';
import AdMob from '../elements/admob';
import aqi from '../utils/aqi';

import { locations } from '../utils/locations';
import tracker from '../utils/tracker';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 22.3218;
const LONGITUDE = 114.1795;
const LATITUDE_DELTA = 0.3;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TEN_SECONDS = 10 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;

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
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  help: {
    position: 'absolute',
    right: 15,
    top: 25,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  currentLocation: {
    position: 'absolute',
    right: 15,
    bottom: 160,
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
    backgroundColor: 'rgba(255,255,255,0.7)',
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

    timer.clearTimeout(this);
    timer.setTimeout(this, 'AdMobInterstitialTimeout', () => {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error => error && console.log(error)));
    }, TEN_SECONDS);
    timer.setInterval(this, 'AdMobInterstitialInterval', () => {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error => error && console.log(error)));
    }, TEN_MINUTES);

    timer.setInterval(this, 'ReloadDataInterval', () => this.prepareData(), TEN_MINUTES);
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
    timer.clearInterval(this);
  }

  getCurrentLocation() {
    return {
      latitude: this.state.location.latitude,
      longitude: this.state.location.longitude,
      latitudeDelta: this.state.gpsEnabled ? 0.1 : LATITUDE_DELTA,
      longitudeDelta: this.state.gpsEnabled ? 0.1 * ASPECT_RATIO : LONGITUDE_DELTA,
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
              title={`${this.state.selectedIndex} is ${this.state.aqiResult[marker.title][this.state.selectedIndex]} in ${marker.title}`}
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

        {/* <TouchableOpacity style={styles.menu} onPress={Actions.settings}>
          <Icon name="settings" size={24} color="#616161" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.help} onPress={Actions.help} >
          <Icon name="help-outline" size={24} color="#616161" />
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

        {this.state.aqiResult && <View style={styles.infomationContainer}>
          <TouchableOpacity
            onPress={() => {
              this.prepareData();
              tracker.trackEvent('user-action', 'fetch-latest-data');
            }}
            style={styles.infomationBubble}
          >
            <View style={styles.infomationBubbleBody}>
              <Text style={styles.infomationBubbleText}>Last Updated On {this.state.aqiResult.time}</Text>
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

        <AdMob />
      </View>
    );
  }
}
