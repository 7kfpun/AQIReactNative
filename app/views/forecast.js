import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeI18n from 'react-native-i18n';

import AdBanner from '../elements/ad-banner';
import forecast from '../utils/forecast';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const deviceLocale = ReactNativeI18n.locale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  body: {
    padding: 10,
  },
  titleBlock: {
    paddingTop: Platform.OS === 'ios' ? 60 : 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  titleText: {
    color: 'black',
    fontSize: 24,
  },
  text: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 30,
  },
});

export default class ForecastModal extends Component {
  static navigationOptions = {
    header: null,
    title: 'Forecast',
    tabBarLabel: I18n.t('forecast'),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="visibility" size={20} color={tintColor || 'gray'} />
    ),
  };

  static translate(text) {
    if (!text) {
      return;
    }

    if (deviceLocale.startsWith('zh-Hans')) {
      return text
        .replace('to', '至')
        .replace('Serious', '严重')
        .replace('Very High', '很高')
        .replace('High', '高')
        .replace('Moderate', '中')
        .replace('Low', '低');
    } else if (deviceLocale.startsWith('zh')) {
      return text
        .replace('to', '至')
        .replace('Serious', '嚴重')
        .replace('Very High', '很高')
        .replace('High', '高')
        .replace('Moderate', '中')
        .replace('Low', '低');
    }

    return text;
  }

  state = {
    isModalShow: false,
    data: {},
  }

  componentDidMount() {
    this.prepareData();
  }

  prepareData() {
    this.setState({ isLoading: true });
    forecast().then((data) => {
      console.log(data);
      this.setState({ data, isLoading: false });
    });
  }

  render() {
    tracker.view('Forecast');
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{I18n.t('forecast_of_health_risk')}</Text>
        </View>

        {this.state.data && this.state.data.general && <ScrollView style={styles.body}>
          <Text style={styles.text}>{this.state.data.date}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={styles.text}>{I18n.t('general_stations')}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.text}>{I18n.t('tomorrow_am')}</Text>
            <Text style={styles.text}>{ForecastModal.translate(this.state.data.general.am)}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.text}>{I18n.t('tomorrow_pm')}</Text>
            <Text style={styles.text}>{ForecastModal.translate(this.state.data.general.pm)}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={styles.text}>{I18n.t('roadside_stations')}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.text}>{I18n.t('tomorrow_am')}</Text>
            <Text style={styles.text}>{ForecastModal.translate(this.state.data.roadside.am)}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.text}>{I18n.t('tomorrow_pm')}</Text>
            <Text style={styles.text}>{ForecastModal.translate(this.state.data.roadside.pm)}</Text>
          </View>
        </ScrollView>}

        <AdBanner />
      </View>
    );
  }
}
