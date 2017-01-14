/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Modal,
  Platform,
  ScrollView,
  DeviceEventEmitter,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { RNLocation as Location } from 'NativeModules';
import { AdMobInterstitial } from 'react-native-admob';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-root-toast';
import timer from 'react-native-timer';

import Marker from './marker';
import AdMob from './admob';
import aqi from './utils/aqi';

import { config } from './config';
import { locations } from './locations';

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
  help: {
    position: 'absolute',
    right: 15,
    top: 25,
    backgroundColor: 'transparent',
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

export default class AQI extends Component {
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

  componentDidMount() {
    this.prepareData();

    AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);
    timer.clearTimeout(this);
    timer.setTimeout(this, 'AdMobInterstitial', () => {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error => error && console.log(error)));
    }, 5000);
  }

  componentWillMount() {
    Location.requestWhenInUseAuthorization()
    // Location.requestAlwaysAuthorization()
    Location.startUpdatingLocation()
    Location.setDistanceFilter(5.0)
    DeviceEventEmitter.addListener('locationUpdated', (location) => {
      console.log('Location update', location);
      this.setState({
        location: location.coords,
        gpsEnabled: true,
      })
    })
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
    return (
      <View style={styles.container}>
        <AdMob />

        <Modal
          animationType={'fade'}
          transparent={false}
          visible={this.state.modalVisible}
        >
          <TouchableOpacity style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ modalVisible: false })} >
            <View>
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>Air Quality Index (AQI)</Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#009866', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text>0-50</Text>
                  </View>
                  <Text>Good</Text>
                </View>
                <Text style={{ fontWeight: '100', marginBottom: 10 }}>Air pollution risk is low.</Text>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#FEDE33', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text>51-100</Text>
                  </View>
                  <Text>Moderate</Text>
                </View>
                <Text style={{ fontWeight: '100', marginBottom: 10 }}>Air quality is acceptable.</Text>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#FE9833', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text>101-150</Text>
                  </View>
                  <Text>Unhealthy for high-risk group</Text>
                </View>
                <Text style={{ fontWeight: '100', marginBottom: 10 }}>High-risk group may have health effects. General public is not affected.</Text>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#CC0033', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text style={{ color: 'white' }}>151-200</Text>
                  </View>
                  <Text>Unhealthy</Text>
                </View>
                <Text style={{ fontWeight: '100', marginBottom: 10 }}>High-risk group may have more serious health effects. Some of the general public may have health effects.</Text>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#660098', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text style={{ color: 'white' }}>201-300</Text>
                  </View>
                  <Text>Very Unhealthy</Text>
                </View>
                <Text style={{ fontWeight: '100', marginBottom: 10 }}>General public have health effects.</Text>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#7E2200', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text style={{ color: 'white' }}>301-500</Text>
                  </View>
                  <Text>Hazardous</Text>
                </View>
                <Text style={{ fontWeight: '100', marginBottom: 10 }}>Some of the general public may have more serious health effects.</Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>Air Quality Health Index (AQHI)</Text>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#4DB748', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text style={{ color: 'white' }}>{'1-3'}</Text>
                  </View>
                  <Text>Low</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#F9AB1A', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text style={{ color: 'white' }}>{'4-6'}</Text>
                  </View>
                  <Text>Moderate</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#ED1B24', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text style={{ color: 'white' }}>{'7'}</Text>
                  </View>
                  <Text>High</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#A04623', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text style={{ color: 'white' }}>{'8-10'}</Text>
                  </View>
                  <Text>Very high</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ backgroundColor: '#000000', paddingHorizontal: 10, width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 30 }}>
                    <Text style={{ color: 'white' }}>{'10+'}</Text>
                  </View>
                  <Text>Serious</Text>
                </View>
              </View>

            </View>
          </TouchableOpacity>
        </Modal>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: this.state.location.latitude,
            longitude: this.state.location.longitude,
            latitudeDelta: this.state.gpsEnabled ? 0.1 : 0.0032,
            longitudeDelta: this.state.gpsEnabled ? 0.1 : 0.221,
          }}
        >
          <TouchableOpacity style={styles.help} onPress={() => this.setState({ modalVisible: true })} >
            <Icon name="help" size={30} color="#FFF" />
          </TouchableOpacity>
          {this.state.aqiResult && this.state.markers.map((marker) => (
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
              onPress={() => this.prepareData()}
              style={styles.infomationBubble}
            >
              <Text>Update on {this.state.aqiResult.time}</Text>
            </TouchableOpacity>
          </View>}
          <View style={styles.buttonContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>

              {['AQI', 'AQHI', 'NO2', 'O3', 'SO2', 'CO', 'PM10', 'PM2.5'].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => this.setState({ selectedIndex: item })}
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
        >Fetching...</Toast>
        </MapView>
      </View>
    );
  }
}

AppRegistry.registerComponent('AQI', () => AQI);
