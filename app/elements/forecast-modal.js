import React, { Component } from 'react';
import {
  StyleSheet,
  Modal,
  Text,
  TouchableHighlight,
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
    marginHorizontal: 60,
    padding: 30,
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
    fontSize: 16,
    lineHeight: 40,
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 35,
  },
});

export default class ForecastModal extends Component {
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

  static translate(text) {
    if (deviceLocale.startsWith('zh')) {
      return text.replace('to', '至').replace('Low', '低').replace('Moderate', '中').replace('High', '高');
    }
    return text
  }

  render() {
    return (
      <View style={styles.forecastHealthRiskButton}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ isModalShow: !this.state.isModalShow })
            tracker.trackEvent('user-action', 'check-forecast');
          }}
        >
          <Icon name="visibility" size={26} color="#616161" />
        </TouchableOpacity>

        {this.state.isModalShow && <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <View style={styles.container}>
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

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                this.setState({ isModalShow: !this.state.isModalShow })
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
