import React from 'react';
import {
  Platform,
} from 'react-native';

import { BannerView, InterstitialAdManager } from 'react-native-fbads';
import { AdMobInterstitial } from 'react-native-admob';
import timer from 'react-native-timer';

import Admob from './admob';

import { config } from '../config';

const TWO_SECONDS = 2 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;

export default class AdBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    timer.clearTimeout(this);
    timer.setTimeout(this, 'AdMobInterstitialTimeout', () => {
      InterstitialAdManager.showAd(config.fbads[Platform.OS].interstital)
        .then((didClick) => {
          console.log('Facebook Interstitial Ad', didClick);
        })
        .catch((error) => {
          console.log('Facebook Interstitial Ad Failed', error);
          AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error1 => error1 && console.log(error1)));
        });
    }, TWO_SECONDS);

    timer.setInterval(this, 'AdMobInterstitialInterval', () => {
      InterstitialAdManager.showAd(config.fbads[Platform.OS].interstital)
        .then((didClick) => {
          console.log('Facebook Interstitial Ad', didClick);
        })
        .catch((error) => {
          console.log('Facebook Interstitial Ad Failed', error);
          AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error1 => error1 && console.log(error1)));
        });
    }, TEN_MINUTES);
  }

  render() {
    if (this.state.showAdMob) {
      return <Admob />;
    }

    return (<BannerView
      placementId={config.fbads[Platform.OS].banner}
      type="standard"
      onClick={() => console.log('click')}
      onError={() => this.setState({ showAdMob: true })}
    />);
  }
}
