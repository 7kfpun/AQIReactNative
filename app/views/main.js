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
  NativeModules,
} from 'react-native';

import { AdMobInterstitial } from 'react-native-admob';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import ReactNativeI18n from 'react-native-i18n';
import RNALocation from 'react-native-android-location';
import timer from 'react-native-timer';

import AdBanner from '../elements/ad-banner';
import Indicator from '../elements/indicator';
import Marker from '../elements/marker';
import Rating from '../elements/rating';

import { aqi } from '../utils/api';
import { locations } from '../utils/locations';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const { RNLocation } = NativeModules;

const { width, height } = Dimensions.get('window');
const deviceLocale = ReactNativeI18n.locale;
console.log('deviceLocale', deviceLocale);

const ASPECT_RATIO = width / height;
const LATITUDE = 22.32;
const LONGITUDE = 114.15;
const LATITUDE_DELTA = 0.75;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const FIVE_SECONDS = 5 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;
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
  defaultLocation: {
    position: 'absolute',
    right: 14,
    bottom: 170,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  currentLocation: {
    position: 'absolute',
    right: 14,
    bottom: 110,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  infomationContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 28 : 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  infomationBubble: {
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
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  bubble: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    paddingHorizontal: 2,
    paddingVertical: 12,
    borderRadius: 20,
  },
  selectedBubble: {
    borderColor: '#29B6F6',
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

let first = true;

export default class MainView extends Component {
  static navigationOptions = {
    header: null,
    title: 'Main',
    tabBarLabel: I18n.t('main'),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="place" size={20} color={tintColor || 'gray'} />
    ),
  };

  static showInterstitial() {
    if (__DEV__) {
      return;
    }

    if (Math.random() < 0.1) {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(errorAdmob => errorAdmob && console.log(errorAdmob)));
    }

    // if (Math.random() < 0.5) {
    //   InterstitialAdManager.showAd(config.fbads[Platform.OS].interstital)
    //     .then((didClick) => {
    //       console.log('Facebook Interstitial Ad', didClick);
    //     })
    //     .catch((error) => {
    //       console.log('Facebook Interstitial Ad Failed', error);
    //       AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(errorAdmob => errorAdmob && console.log(errorAdmob)));
    //     });
    // } else {
    //   AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(errorAdmob => errorAdmob && console.log(errorAdmob)));
    // }
  }

  static isOutOfBound(latitude, longitude) {
    const distance = ((latitude - LATITUDE) * (latitude - LATITUDE)) + ((longitude - LONGITUDE) * (longitude - LONGITUDE));
    console.log('Distance', distance);
    return distance > 0.2;
  }

  static getDefaultLocation() {
    return {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  }

  state = {
    location: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    },
    markers: locations,
    selectedIndex: 'AQI',
    isLoading: false,
    gpsEnabled: false,
  };

  componentDidMount() {
    timer.clearTimeout(this);
    timer.setTimeout(this, 'InterstitialTimeout', () => {
      MainView.showInterstitial();
    }, FIVE_SECONDS);

    timer.setInterval(this, 'InterstitialInterval', () => {
      MainView.showInterstitial();
    }, TEN_MINUTES);

    if (Platform.OS === 'ios') {
      RNLocation.requestWhenInUseAuthorization();
      // RNLocation.requestAlwaysAuthorization();
      RNLocation.startUpdatingLocation();
      RNLocation.setDistanceFilter(5.0);
      DeviceEventEmitter.addListener('locationUpdated', (location) => {
        console.log('Location updated', location);
        if (location && location.coords && location.coords.latitude && location.coords.longitude) {
          this.setState({
            location: location.coords,
            gpsEnabled: true,
          });

          this.initialLocation(location.coords.latitude, location.coords.longitude);
        }
      });
    } else {
      DeviceEventEmitter.addListener('updateLocation', (location) => {
        console.log('Location updated', location);
        if (location && location.Latitude && location.Longitude) {
          this.setState({
            location: {
              latitude: location.Latitude,
              longitude: location.Longitude,
            },
            gpsEnabled: true,
          });

          this.initialLocation(location.Latitude, location.Longitude);
        }
      });

      // Initialize RNALocation
      RNALocation.getLocation();
    }

    this.prepareData();

    timer.setInterval(this, 'ReloadDataInterval', () => this.prepareData(), FIVE_MINUTES);
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
    timer.clearInterval(this);
  }

  onRegionChange(region) {
    console.log(region);
    this.setState({ region, selectedLocation: null });
  }

  getCurrentLocation() {
    return {
      latitude: this.state.location.latitude,
      longitude: this.state.location.longitude,
      latitudeDelta: this.state.gpsEnabled ? 0.1 : LATITUDE_DELTA,
      longitudeDelta: this.state.gpsEnabled ? 0.1 * ASPECT_RATIO : LONGITUDE_DELTA,
    };
  }

  initialLocation(latitude, longitude) {
    if (first) {
      first = false;
      if (MainView.isOutOfBound(latitude, longitude)) {
        timer.setTimeout(this, 'MoveToHongKong', () => {
          this.map.animateToRegion(MainView.getDefaultLocation());
        }, 1000);
      } else {
        timer.setTimeout(this, 'MoveToCurrentLocation', () => {
          this.map.animateToRegion(this.getCurrentLocation());
        }, 500);
      }
    }
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
    tracker.view('Main');
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            ref={(ref) => { this.map = ref; }}
            initialRegion={this.getCurrentLocation()}
            onRegionChange={region => this.onRegionChange(region)}
          >
            {this.state.aqiResult && this.state.markers.map(marker => (
              <MapView.Marker
                key={`${marker.latlng.latitude}${this.state.selectedIndex}`}
                coordinate={marker.latlng}
                onPress={() => {
                  console.log('marker', marker);
                  tracker.logEvent('check-main-details', marker);
                  this.props.navigation.navigate('MainDetails', { item: marker });
                }}
              >
                {this.state.aqiResult[marker.title] &&
                  <Marker amount={this.state.aqiResult[marker.title][this.state.selectedIndex]} index={this.state.selectedIndex} />
                }
              </MapView.Marker>
            ))}

            {this.state.gpsEnabled && this.state.location && <MapView.Marker
              coordinate={this.state.location}
            />}
          </MapView>

          {/* <TouchableOpacity style={styles.menu} onPress={() => navigate('Settings')}>
            <Animatable.View animation="tada" delay={2000} iterationCount={40}>
              <Icon name="notifications-active" size={26} color="#616161" />
            </Animatable.View>
          </TouchableOpacity> */}

          {this.state.aqiResult && <View style={styles.infomationContainer}>
            <TouchableOpacity
              onPress={() => {
                this.prepareData();
                tracker.logEvent('fetch-latest-data');
              }}
              style={styles.infomationBubble}
            >
              <View style={styles.infomationBubbleBody}>
                <Text style={styles.infomationBubbleText}>{this.state.aqiResult.time}</Text>
                {!this.state.isLoading && <Icon name="refresh" style={{ marginLeft: 5 }} size={20} color="#616161" />}
                {this.state.isLoading && <ActivityIndicator style={{ marginLeft: 5 }} />}
              </View>
            </TouchableOpacity>
          </View>}

          <Indicator />

          <TouchableOpacity
            style={styles.defaultLocation}
            onPress={() => {
              this.map.animateToRegion(MainView.getDefaultLocation());
              tracker.logEvent('move-to-default-location');
            }}
          >
            <Icon name="crop-free" size={26} color="#616161" />
          </TouchableOpacity>

          {this.state.gpsEnabled && <TouchableOpacity
            style={styles.currentLocation}
            onPress={() => {
              const currentLocation = this.getCurrentLocation();
              if (currentLocation) {
                this.map.animateToRegion(currentLocation);
                tracker.logEvent('move-to-current-location', currentLocation);
              }
            }}
          >
            <Icon name="near-me" size={26} color="#616161" />
          </TouchableOpacity>}

          <Rating />

          <View style={styles.buttonContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['AQI', 'AQHI', 'NO2', 'O3', 'SO2', 'CO', 'PM10', 'PM2.5'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    this.setState({ selectedIndex: item });
                    tracker.logEvent('select-index', { label: item });
                  }}
                  style={[styles.bubble, styles.button, this.state.selectedIndex === item ? styles.selectedBubble : {}]}
                >
                  <Text style={styles.text}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <AdBanner adUnitID="hkaqi-main-ios-footer" />
        </View>
      </View>
    );
  }
}

MainView.propTypes = {
  navigation: React.PropTypes.shape({
    navigate: React.PropTypes.func.isRequired,
  }).isRequired,
};
