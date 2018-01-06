import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ReactNativeI18n from 'react-native-i18n';

import helpTexts from '../utils/helpTexts';

const deviceLocale = ReactNativeI18n.locale;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    top: Platform.OS === 'ios' ? 56 : 24,
    width: 124,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
  },
  bar: {
    width: 16,
    height: 5,
    marginRight: 4,
  },
  text: {
    color: 'black',
    fontSize: 10,
    fontWeight: '300',
    textShadowColor: 'gray',
    textShadowOffset: {
      width: 0.8,
      height: 0.8,
    },
    textShadowRadius: 1,
  },
});

export default class Indicator extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        {helpTexts.AQI.map((item) => {
          let itemCategory;
          if (deviceLocale.startsWith('zh-Hans')) {
            itemCategory = item.hansCategory;
          } else if (deviceLocale.startsWith('zh')) {
            itemCategory = item.hantCategory;
          } else {
            itemCategory = item.category;
          }
          return (
            <View style={styles.item} key={item.index}>
              <View style={[styles.bar, { backgroundColor: item.backgroundColor }]} />
              <Text style={styles.text}>{itemCategory}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}
