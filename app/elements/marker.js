import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#FF5A5F',
    padding: 3,
    borderRadius: 5,
    borderColor: '#D23F44',
    borderWidth: 0.5,
  },
  amount: {
    color: '#FFFFFF',
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

export default class AirMarker extends React.Component {
  render() {
    const { fontSize, amount, index } = this.props;

    let color;
    if (amount.includes('/')) {
      amountColor = amount.split('/')[1];
    } else {
      amountColor = amount;
    }

    // 0-50 Good Air pollution risk is low.
    // 51-100 Moderate Air quality is acceptable.
    // 101-150 Unhealthy for high-risk group High-risk group may have health effects. General public is not affected.
    // 151-200 Unhealthy High-risk group may have more serious health effects. Some of the general public may have health effects.
    // 201-300 Very Unhealthy General public have health effects.
    // 301-500 Hazardous Some of the general public may have more serious health effects.
    if (amountColor <= 50) {
      color = '#009866';
    } else if (amountColor > 50 && amountColor <= 100) {
      color = '#FEDE33';
    } else if (amountColor > 100 && amountColor <= 150) {
      color = '#FE9833';
    } else if (amountColor > 150 && amountColor <= 200) {
      color = '#CC0033';
    } else if (amountColor > 200 && amountColor <= 300) {
      color = '#660098';
    } else if (amountColor > 300 && amountColor <= 500) {
      color = '#7E2200';
    } else {
      color = 'gray';
    }

    // 1-3 Low
    // 4-6 Moderate
    // 7 High
    // 8-10 Very high
    // 10+ Serious
    if (index === 'AQHI') {
      if (amount >= 1 && amount <= 3) {
        color = '#4DB748';
      } else if (amount >= 4 && amount <= 6) {
        color = '#F9AB1A';
      } else if (amount === 7) {
        color = '#ED1B24';
      } else if (amount >= 8 && amount <= 10) {
        color = '#A04623';
      } else if (amount > 10) {
        color = '#000000';
      } else {
        color = 'gray';
      }
    }

    let showAmount;
    if (amount === '/*' || amount === '-*' || amount === '-/-' || amount === '/-') {
      showAmount = '-';
    } else {
      showAmount = amount;
    }

    return (
      <View style={styles.container}>
        <View style={[styles.bubble, { backgroundColor: color, borderColor: 'white' }]}>
          <Text style={[styles.amount, { fontSize }]}>{showAmount}</Text>
        </View>
        <View style={[styles.arrowBorder, { borderTopColor: 'white' }]} />
        <View style={[styles.arrow, { borderTopColor: color }]} />
      </View>
    );
  }
}

AirMarker.propTypes = {
  amount: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
};
AirMarker.defaultProps = {
  fontSize: 16,
};
