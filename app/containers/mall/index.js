import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Admob from '../../components/admob';
import I18n from '../../utils/i18n';
import tracker from '../../utils/tracker';

import { config } from '../../config';

const { width } = Dimensions.get('window');

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
    paddingHorizontal: 10,
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

export default class MallView extends Component {
  static navigationOptions = {
    header: null,
    title: 'Help',
    tabBarLabel: I18n.t('mall'),
    tabBarIcon: ({ tintColor }) => (
      <Animatable.View animation="tada" iterationCount={25}>
        <Icon name="shopping-cart" size={21} color={tintColor || 'gray'} />
      </Animatable.View>
    ),
  };

  static openFeedbackUrl() {
    const url = I18n.isZh ? config.feedbackUrl.zh : config.feedbackUrl.en;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
        tracker.logEvent('open-feedback-url');
      }
    });
  }

  static openMyFairLady() {
    const url = 'https://myfairladyhk.boutir.com/?ref=hkaqi';
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
        tracker.logEvent('mall', { site: 'my-fair-lady' });
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{I18n.t('mall')}</Text>
          <TouchableOpacity onPress={MallView.openFeedbackUrl}>
            <Icon name="mail-outline" size={30} color="gray" />
          </TouchableOpacity>
        </View>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress={MallView.openMyFairLady}>
            <Image
              resizeMode="contain"
              style={{
                width, height: 200, borderColor: '#01c4a5', borderWidth: 6
              }}
              source={require('../../assets/my_fair_lady.png')}
            />
            <View style={styles.block}>
              <Text style={{ fontWeight: '500', marginVertical: 20 }}>My Fair Lady (HK)</Text>
              <Text style={{ fontWeight: '300' }}>{I18n.t('my_fair_lady_description')}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <Admob unitId={config.admob[`hkaqi-mall-${Platform.OS}-footer`]} />
      </SafeAreaView>
    );
  }
}
