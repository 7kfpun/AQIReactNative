import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 25,
    backgroundColor: 'transparent',
  },
  block: {
    marginVertical: 30,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  index: {
    paddingHorizontal: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
  },
  description: {
    fontWeight: '100',
    marginBottom: 10,
  },
});

export default class HelpView extends Component {
  render() {
    GoogleAnalytics.trackScreenView('Help');
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.block}>
            <Text style={styles.title}>Air Quality Index (AQI)</Text>
            <View style={styles.row}>
              <View style={[{ backgroundColor: '#009866' }, styles.index]}>
                <Text>0-50</Text>
              </View>
              <Text>Good</Text>
            </View>
            <Text style={styles.description}>Air pollution risk is low.</Text>

            <View style={styles.row}>
              <View style={[{ backgroundColor: '#FEDE33' }, styles.index]}>
                <Text>51-100</Text>
              </View>
              <Text>Moderate</Text>
            </View>
            <Text style={styles.description}>Air quality is acceptable.</Text>

            <View style={styles.row}>
              <View style={[{ backgroundColor: '#FE9833' }, styles.index]}>
                <Text>101-150</Text>
              </View>
              <Text>Unhealthy for high-risk group</Text>
            </View>
            <Text style={styles.description}>High-risk group may have health effects. General public is not affected.</Text>

            <View style={styles.row}>
              <View style={[{ backgroundColor: '#CC0033' }, styles.index]}>
                <Text style={{ color: 'white' }}>151-200</Text>
              </View>
              <Text>Unhealthy</Text>
            </View>
            <Text style={styles.description}>High-risk group may have more serious health effects. Some of the general public may have health effects.</Text>

            <View style={styles.row}>
              <View style={[{ backgroundColor: '#660098' }, styles.index]}>
                <Text style={{ color: 'white' }}>201-300</Text>
              </View>
              <Text>Very Unhealthy</Text>
            </View>
            <Text style={styles.description}>General public have health effects.</Text>

            <View style={styles.row}>
              <View style={[{ backgroundColor: '#7E2200' }, styles.index]}>
                <Text style={{ color: 'white' }}>301-500</Text>
              </View>
              <Text>Hazardous</Text>
            </View>
            <Text style={styles.description}>Some of the general public may have more serious health effects.</Text>
          </View>

          <View style={styles.block}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Air Quality Health Index (AQHI)</Text>

            <View style={styles.row}>
              <View style={[{ backgroundColor: '#4DB748' }, styles.index]}>
                <Text style={{ color: 'white' }}>{'1-3'}</Text>
              </View>
              <Text>Low</Text>
            </View>
            <View style={styles.row}>
              <View style={[{ backgroundColor: '#F9AB1A' }, styles.index]}>
                <Text style={{ color: 'white' }}>{'4-6'}</Text>
              </View>
              <Text>Moderate</Text>
            </View>
            <View style={styles.row}>
              <View style={[{ backgroundColor: '#ED1B24' }, styles.index]}>
                <Text style={{ color: 'white' }}>{'7'}</Text>
              </View>
              <Text>High</Text>
            </View>
            <View style={styles.row}>
              <View style={[{ backgroundColor: '#A04623' }, styles.index]}>
                <Text style={{ color: 'white' }}>{'8-10'}</Text>
              </View>
              <Text>Very high</Text>
            </View>
            <View style={styles.row}>
              <View style={[{ backgroundColor: '#000000' }, styles.index]}>
                <Text style={{ color: 'white' }}>{'10+'}</Text>
              </View>
              <Text>Serious</Text>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.close} onPress={Actions.pop} >
          <Icon name="close" size={30} color="gray" />
        </TouchableOpacity>
      </View>
    );
  }
}
