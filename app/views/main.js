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

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import ReactNativeI18n from 'react-native-i18n';
// import RNALocation from 'react-native-android-location';
import timer from 'react-native-timer';

import AdBanner from '../elements/ad-banner';
import ForecastModal from '../elements/forecast-modal';
import Marker from '../elements/marker';
import Rating from '../elements/rating';

import { locations } from '../utils/locations';
import aqi from '../utils/aqi';
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
    right: 14,
    bottom: 120,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  infomationContainer: {
    position: 'absolute',
    top: 28,
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
  static navigationOptions = {
    header: null,
    title: 'Main',
  };

  static isOutOfBound(latitude, longitude) {
    const distance = ((latitude - LATITUDE) * (latitude - LATITUDE)) + ((longitude - LONGITUDE) * (longitude - LONGITUDE));
    console.log('Distance', distance);
    return distance > 0.2;
  }

  // static renderDotIndicator() {
  //   return <PagerDotIndicator pageCount={3} />;
  // }

  static getHongKongLocation() {
    return {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  }

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

  componentDidMount() {
    if (Platform.OS === 'ios') {
      RNLocation.requestWhenInUseAuthorization();
      // RNLocation.requestAlwaysAuthorization();
      RNLocation.startUpdatingLocation();
      RNLocation.setDistanceFilter(5.0);
      DeviceEventEmitter.addListener('locationUpdated', (location) => {
        console.log('Location updated', location);
        this.setState({
          location: location.coords,
          gpsEnabled: true,
        });

        if (MainView.isOutOfBound(location.coords.latitude, location.coords.longitude)) {
          timer.setTimeout(this, 'MoveToHongKong', () => {
            this.map.animateToRegion(MainView.getHongKongLocation());
          }, 1000);
        }
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
    const { navigate } = this.props.navigation;
    tracker.trackScreenView('Main');
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            ref={(ref) => { this.map = ref; }}
            initialRegion={this.getCurrentLocation()}
            onRegionChange={region => this.onRegionChange(region)}
          >
            {this.state.aqiResult && this.state.markers.map((marker) => {
              let title;
              if (deviceLocale.startsWith('zh-Hans')) {
                title = `${marker.title} 地区 ${this.state.selectedIndex} 值为 ${this.state.aqiResult[marker.title] && this.state.aqiResult[marker.title][this.state.selectedIndex]}`;
              } else if (deviceLocale.startsWith('zh')) {
                title = `${marker.title} 地区 ${this.state.selectedIndex} 值為 ${this.state.aqiResult[marker.title] && this.state.aqiResult[marker.title][this.state.selectedIndex]}`;
              } else {
                title = `${this.state.selectedIndex} is ${this.state.aqiResult[marker.title] && this.state.aqiResult[marker.title][this.state.selectedIndex]} in ${marker.title}`;
              }

              return (<MapView.Marker
                key={marker.latlng.latitude}
                coordinate={marker.latlng}
                title={title}
                description={marker.description}
                onPress={() => this.setState({ selectedLocation: marker.title })}
              >
                {this.state.aqiResult[marker.title]
                  && <Marker amount={this.state.aqiResult[marker.title][this.state.selectedIndex]} index={this.state.selectedIndex} />}
              </MapView.Marker>);
            })}

            {this.state.gpsEnabled && this.state.location && <MapView.Marker
              coordinate={this.state.location}
            />}
          </MapView>

          <TouchableOpacity style={styles.menu} onPress={() => navigate('Settings')}>
            <Animatable.View animation="tada" delay={2000} iterationCount={20}>
              <Icon name="notifications-active" size={26} color="#616161" />
            </Animatable.View>
          </TouchableOpacity>

          {this.state.aqiResult && <View style={styles.infomationContainer}>
            <TouchableOpacity
              onPress={() => {
                this.prepareData();
                tracker.trackEvent('user-action', 'fetch-latest-data');
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

          <TouchableOpacity style={styles.help} onPress={() => navigate('Help')} >
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

          <ForecastModal />

          <Rating />

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

MainView.propTypes = {
  navigation: React.PropTypes.shape({
    navigate: React.PropTypes.func.isRequired,
  }).isRequired,
};
