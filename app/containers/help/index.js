import React, { Component } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeI18n from 'react-native-i18n';

import Admob from '../../components/admob';
import I18n from '../../utils/i18n';
import helpTexts from '../../utils/helpTexts';

import { config } from '../../config';

const deviceLocale = ReactNativeI18n.locale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 10,
    backgroundColor: 'white',
  },
  titleBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  block: {
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: 'black',
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
      <Icon name="help" size={21} color={tintColor || 'gray'} />
    ),
  };

  static openFeedbackUrl() {
    const url = I18n.isZh ? config.feedbackUrl.zh : config.feedbackUrl.en;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={styles.block}>
            <View style={styles.titleBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="chevron-left" size={40} color="gray" onPress={this.goBack} />
                <Text style={styles.title}>{I18n.t('aqi_full')}</Text>
              </View>
              <TouchableOpacity onPress={HelpView.openFeedbackUrl}>
                <Icon name="mail-outline" size={30} color="gray" />
              </TouchableOpacity>
            </View>

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

              return (
                <View key={item.index}>
                  <View style={styles.row}>
                    <View style={[{ backgroundColor: item.backgroundColor }, styles.index]}>
                      <Text style={{ color: item.fontColor }}>{item.index}</Text>
                    </View>
                    <Text>{itemCategory}</Text>
                  </View>
                  <Text style={styles.description}>{itemDescription}</Text>
                </View>
              );
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

              return (
                <View key={item.index} style={styles.row}>
                  <View style={[{ backgroundColor: item.backgroundColor }, styles.index]}>
                    <Text style={{ color: 'white' }}>{item.index}</Text>
                  </View>
                  {<Text>{itemHealthRisk}</Text>}
                </View>
              );
            })}
          </View>
        </ScrollView>

        <Admob unitId={config.admob[`hkaqi-help-${Platform.OS}-footer`]} />
      </SafeAreaView>
    );
  }
}
