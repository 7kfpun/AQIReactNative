import React, { Component } from 'react';
import { number, shape, string } from 'prop-types';

import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import I18n from '../../../utils/i18n';
import { getClosestStation } from '../../../utils/locations';
import { getColor } from '../../../utils/indexes';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    top: 55,
    width: width / 2 - 15,
    height: 65,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 6,
  },
  weatherContainer: {
    flex: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  temperatureContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  aqiContainer: {
    flex: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#D3D3D3',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
  },
  text: {
    fontSize: 10,
    textAlign: 'center',
  },
});

export default class ClosestStation extends Component {
  static propTypes = {
    lat: number,
    long: number,
    aqiResult: shape({}),
    selectedIndex: string,
  };

  static defaultProps = {
    lat: 25.062361,
    long: 121.507972,
    aqiResult: {},
    selectedIndex: 'AQI',
  };

  state = {
    realtimeWeatherData: {
      Temp: '- ',
    },
  };

  componentDidMount() {
    const { lat, long } = this.props;
  }

  render() {
    const { lat, long, aqiResult, selectedIndex } = this.props;

    const { title, title_hant, title_hans } = getClosestStation(lat, long);

    const amount =
      (aqiResult && aqiResult[title] && aqiResult[title][selectedIndex]) || '-';

    return (
      <View style={styles.container}>
        <View style={styles.weatherContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!I18n.isZh && <Text style={styles.text}>{title}</Text>}
            {I18n.isZhHant && <Text style={styles.text}>{title_hant}</Text>}
            {I18n.isZhHans && <Text style={styles.text}>{title_hans}</Text>}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[styles.statusText, { fontSize: I18n.isZh ? 14 : 11 }]}
            >
              {getColor(selectedIndex, amount).status}
            </Text>
          </View>
        </View>
        <View style={styles.aqiContainer}>
          <View
            style={{
              borderRadius: 4,
              padding: 2,
              paddingHorizontal: 5,
              backgroundColor: getColor(selectedIndex, amount).color,
              marginTop: -1,
            }}
          >
            <Text
              style={[
                styles.text,
                { fontSize: amount.includes('/') ? 8 : 10 },
                { color: getColor(selectedIndex, amount).fontColor },
              ]}
            >
              {selectedIndex} {amount}
            </Text>
          </View>
          <Image
            style={{ width: 30, height: 30, marginBottom: -6 }}
            source={getColor(selectedIndex, amount).image}
          />
        </View>
      </View>
    );
  }
}
