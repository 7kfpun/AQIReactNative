import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeI18n from 'react-native-i18n';

import forecast from '../utils/forecast';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const deviceLocale = ReactNativeI18n.locale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    marginBottom: 180,
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
  },
  forecastHealthRiskButton: {
    position: 'absolute',
    right: 14,
    bottom: 60,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  titleText: {
    color: 'black',
    fontSize: 14,
    lineHeight: 35,
  },
  text: {
    color: 'black',
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 30,
  },
});

export default class ForecastModal extends Component {
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
    return (
      <View style={styles.forecastHealthRiskButton}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ isModalShow: !this.state.isModalShow });
            tracker.trackEvent('user-action', 'check-forecast');
          }}
        >
          <Icon name="visibility" size={26} color="#616161" />
        </TouchableOpacity>

        {this.state.isModalShow && <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setState({ isModalShow: false }); }}
        >
          <View style={styles.container}>
            <ScrollView>
              <Text style={styles.titleText}>{I18n.t('forecast_of_health_risk')}</Text>
              <Text style={styles.titleText}>{this.state.data.date}</Text>

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
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                this.setState({ isModalShow: !this.state.isModalShow });
                tracker.trackEvent('user-action', 'check-forecast');
              }}
            >
              <Icon name="clear" size={30} color="#616161" />
            </TouchableOpacity>
          </View>
        </Modal>}
      </View>
    );
  }
}
