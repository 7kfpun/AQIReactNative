import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import store from 'react-native-simple-store';

import Marker from './components/marker';
import ClosestStation from './components/closest-station';

import Admob from '../../components/admob';
import Rating from '../../components/rating';

import { aqi } from '../../utils/api';
import { locations } from '../../utils/locations';
import { indexTypes } from '../../utils/indexes';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 22.32;
const LONGITUDE = 114.15;
const LATITUDE_DELTA = 0.75;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
    top: 55,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
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

export default class Main extends Component {
  static navigationOptions = {
    header: null,
    title: 'Main',
    tabBarLabel: I18n.t('main'),
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name="ios-map"
        size={20}
        color={tintColor}
      />
    ),
  };

  static showInterstitial() {
    if (__DEV__) {
      return;
    }

    if (Math.random() < 0.2) {
      // AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(errorAdmob => errorAdmob && console.log(errorAdmob)));
    }
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
    centerLocation: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
    },
    markers: locations,
    selectedIndex: 'AQI',
    isLoading: false,
    gpsEnabled: false,
  };

  componentDidMount() {
    this.checkSelectedIndex();
    this.requestLocationPermission();

    // fetching data
    this.fetchData();
    if (!this.reloadFetchLatestDataInterval) {
      this.reloadFetchLatestDataInterval = setInterval(() => {
        this.fetchData();
        tracker.logEvent('reload-fetch-latest-data');
      }, TEN_MINUTES);
    }
  }

  fetchData() {
    this.setState({ isLoading: true });
    aqi().then((result) => {
      this.setState({
        aqiResult: result,
        isLoading: false,
      });
    });
  }

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      navigator.geolocation.requestAuthorization();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: I18n.t('location_permission.title'),
            message: I18n.t('location_permission.description'),
          },
        );
        console.log(granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({
            gpsEnabled: true,
          });
          this.checkLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  loadMapContent = async () => {
    if (Platform.OS === 'ios') {
      this.checkLocation();
    } else {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.checkLocation();
      } else {
        this.requestLocationPermission();
      }
    }
  }

  checkLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('geolocation', position);
        this.setState({
          location: position.coords,
          gpsEnabled: true,
        });

        const moveLocation = Main.isOutOfBound(position.coords.latitude, position.coords.longitude) ? Main.getDefaultLocation() : this.getCurrentLocation();
        try {
          this.map.animateToRegion(moveLocation);
        } catch (err) {
          log.logError(`Map animateToRegion failed: ${JSON.stringify(err)}`);
        }
      },
      (error) => {
        this.requestLocationPermission();
        if (!this.state.isLocationMovedToDefault) {
          // alert(error.message);
          this.setState({ isLocationMovedToDefault: true });
          setTimeout(() => {
            try {
              console.log(error);
              this.map.animateToRegion(Main.getDefaultLocation());
            } catch (err) {
              log.logError(`Map animateToRegion failed: ${JSON.stringify(err)}`);
            }
          }, 2000);
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

    this.watchPosition = navigator.geolocation.watchPosition((position) => {
      this.setState({
        location: position.coords,
        gpsEnabled: true,
      });
    });
  }

  componentWillUnmount() {
    if (this.watchPosition) navigator.geolocation.clearWatch(this.watchPosition);
    if (this.reloadFetchLatestDataInterval) clearInterval(this.reloadFetchLatestDataInterval);
    if (this.moveToHongKongTimeout) clearTimeout(this.moveToHongKongTimeout);
    if (this.moveToCurrentLocationTimeout) clearTimeout(this.moveToCurrentLocationTimeout);

    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  onRegionChange(region) {
    console.log(region);
  }

  onRegionChangeComplete(region) {
    console.log('onRegionChangeComplete', region);
    this.setState({
      centerLocation: region,
    });
  }

  getCurrentLocation() {
    return {
      latitude: this.state.location.latitude,
      longitude: this.state.location.longitude,
      latitudeDelta: this.state.gpsEnabled ? 0.1 : LATITUDE_DELTA,
      longitudeDelta: this.state.gpsEnabled ? 0.1 * ASPECT_RATIO : LONGITUDE_DELTA,
    };
  }

  checkSelectedIndex() {
    const that = this;
    store.get('selectedIndex').then((selectedIndex) => {
      if (selectedIndex) {
        that.setState({
          selectedIndex,
        });
      }
    });
  }

  initialLocation(latitude, longitude) {
    if (first) {
      first = false;
      if (Main.isOutOfBound(latitude, longitude)) {
        this.moveToHongKongTimeout = setTimeout(() => {
          this.map.animateToRegion(Main.getDefaultLocation());
        }, 1000);
      } else {
        this.moveToCurrentLocationTimeout = setTimeout(() => {
          this.map.animateToRegion(this.getCurrentLocation());
        }, 500);
      }
    }
  }

  render() {
    const {
      centerLocation,
      aqiResult,
      selectedIndex,
    } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            ref={(ref) => { this.map = ref; }}
            initialRegion={this.getCurrentLocation()}
            onRegionChange={region => this.onRegionChange(region)}
            onRegionChangeComplete={region =>
              this.onRegionChangeComplete(region)
            }
            onMapReady={this.loadMapContent}
            showsUserLocation={true}
          >
            {aqiResult && this.state.markers.map(marker => (
              <MapView.Marker
                key={`${marker.latlng.latitude}${selectedIndex}`}
                coordinate={marker.latlng}
                onPress={() => {
                  console.log('marker', marker);
                  tracker.logEvent('check-main-details', marker);
                  this.props.navigation.navigate('map-details', { item: marker });
                }}
              >
                {aqiResult[marker.title] &&
                  <Marker amount={aqiResult[marker.title][selectedIndex]} index={selectedIndex} />
                }
              </MapView.Marker>
            ))}
          </MapView>

          {aqiResult &&
            <View style={styles.infomationContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.fetchData();
                  tracker.logEvent('fetch-latest-data');
                }}
                style={styles.infomationBubble}
              >
                <View style={styles.infomationBubbleBody}>
                  <Text style={styles.infomationBubbleText}>{aqiResult.time}</Text>
                  {!this.state.isLoading && <Icon name="refresh" style={{ marginLeft: 5 }} size={20} color="#616161" />}
                  {this.state.isLoading && <ActivityIndicator style={{ marginLeft: 5 }} />}
                </View>
              </TouchableOpacity>
            </View>}

          <ClosestStation
            aqiResult={aqiResult}
            selectedIndex={selectedIndex}
            lat={centerLocation.latitude}
            long={centerLocation.longitude}
          />

          <TouchableOpacity style={styles.help} onPress={() => this.props.navigation.navigate('map-help')}>
            <Icon name="help-outline" size={30} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.defaultLocation}
            onPress={() => {
              this.map.animateToRegion(Main.getDefaultLocation());
              tracker.logEvent('move-to-default-location');
            }}
          >
            <Icon name="crop-free" size={26} color="#616161" />
          </TouchableOpacity>

          {this.state.gpsEnabled &&
            <TouchableOpacity
              style={styles.currentLocation}
              onPress={() => {
                const currentLocation = this.getCurrentLocation();
                if (currentLocation) {
                  console.log('currentLocation', currentLocation);
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
              {indexTypes.map(item => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => {
                    this.setState({ selectedIndex: item.name });
                    store.save('selectedIndex', item.name);
                    tracker.logEvent('select-index', { label: item.name });
                  }}
                  style={[styles.bubble, styles.button, selectedIndex === item.name ? styles.selectedBubble : {}]}
                >
                  <Text style={styles.text}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Admob unitId={`hkaqi-main-${Platform.OS}-footer`} />
        </View>
      </SafeAreaView>
    );
  }
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
