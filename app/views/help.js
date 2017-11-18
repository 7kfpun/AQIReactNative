import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import shortid from 'shortid';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeI18n from 'react-native-i18n';

import AdBanner from '../elements/ad-banner';
import I18n from '../utils/i18n';
import helpTexts from '../utils/helpTexts';
import tracker from '../utils/tracker';

const deviceLocale = ReactNativeI18n.locale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: 'white',
  },
  block: {
    paddingHorizontal: 10,
    marginTop: Platform.OS === 'ios' ? 40 : 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: 'black',
    marginBottom: 30,
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
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default class HelpView extends Component {
  static navigationOptions = {
    header: null,
    title: 'Help',
    tabBarLabel: I18n.t('help'),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="info-outline" size={21} color={tintColor || 'gray'} />
    ),
  };

  render() {
    tracker.view('Help');
    return (
      <View style={styles.container}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={styles.block}>
            <Text style={styles.title}>{I18n.t('aqi_full')}</Text>

            {helpTexts.AQI.map((item) => {
              let itemCategory;
              if (deviceLocale.startsWith('zh-Hans')) {
                itemCategory = item.hansCategory;
                itemDescription = item.hansMeaning;
              } else if (deviceLocale.startsWith('zh')) {
                itemCategory = item.hantCategory;
                itemDescription = item.hantMeaning;
              } else {
                itemCategory = item.category;
                itemDescription = item.meaning;
              }

              return (<View key={shortid.generate()}>
                <View style={styles.row}>
                  <View style={[{ backgroundColor: item.backgroundColor }, styles.index]}>
                    <Text style={{ color: item.fontColor }}>{item.index}</Text>
                  </View>
                  <Text>{itemCategory}</Text>
                </View>
                <Text style={styles.description}>{itemDescription}</Text>
              </View>);
            })}
          </View>

          <View style={styles.block}>
            <Text style={styles.title}>{I18n.t('aqhi_full')}</Text>

            {helpTexts.AQHI.map((item) => {
              let itemHealthRisk;
              if (deviceLocale.startsWith('zh-Hans')) {
                itemHealthRisk = item.hansHealthRisk;
              } else if (deviceLocale.startsWith('zh')) {
                itemHealthRisk = item.hantHealthRisk;
              } else {
                itemHealthRisk = item.healthRisk;
              }

              return (<View key={shortid.generate()} style={styles.row}>
                <View style={[{ backgroundColor: item.backgroundColor }, styles.index]}>
                  <Text style={{ color: 'white' }}>{item.index}</Text>
                </View>
                {<Text>{itemHealthRisk}</Text>}
              </View>);
            })}
          </View>
        </ScrollView>

        <AdBanner />
      </View>
    );
  }
}
