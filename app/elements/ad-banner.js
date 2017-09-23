import React from 'react';
import {
  Platform,
} from 'react-native';

import { BannerView, InterstitialAdManager } from 'react-native-fbads';
import { AdMobInterstitial } from 'react-native-admob';
import timer from 'react-native-timer';

import Admob from './admob';

import { config } from '../config';

const FIVE_SECONDS = 5 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;

export default class AdBanner extends React.Component {
  static showInterstitial() {
    if (__DEV__) {
      return;
    }

    if (Math.random() < 0.5) {
      InterstitialAdManager.showAd(config.fbads[Platform.OS].interstital)
        .then((didClick) => {
          console.log('Facebook Interstitial Ad', didClick);
        })
        .catch((error) => {
          console.log('Facebook Interstitial Ad Failed', error);
          AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(errorAdmob => errorAdmob && console.log(errorAdmob)));
        });
    } else {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(errorAdmob => errorAdmob && console.log(errorAdmob)));
    }
  }

  state = {
    adType: Math.random() < 0.5 ? 'FBADS' : 'ADMOB',
  };

  componentDidMount() {
    timer.clearTimeout(this);
    timer.setTimeout(this, 'AdMobInterstitialTimeout', () => {
      AdBanner.showInterstitial();
    }, FIVE_SECONDS);

    timer.setInterval(this, 'AdMobInterstitialInterval', () => {
      AdBanner.showInterstitial();
    }, TEN_MINUTES);
  }

  render() {
    if (this.state.adType === 'ADMOB') {
      return <Admob />;
    }

    return (<BannerView
      placementId={config.fbads[Platform.OS].banner}
      type="standard"
      onClick={() => console.log('click')}
      onError={() => this.setState({ adType: 'ADMOB' })}
    />);
  }
}
