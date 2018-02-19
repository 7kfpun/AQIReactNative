import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { AdMobBanner } from 'react-native-admob';
import DeviceInfo from 'react-native-device-info';

import { config } from '../config';

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: 'center',
  },
});

export default class Admob extends Component {
  state = {
    isReceived: false,
    isReceivedFailed: false,
  };

  render() {
    if (this.state.isReceivedFailed) {
      return null;
    }

    const height = DeviceInfo.isTablet() || this.props.bannerSize === 'largeBanner' ? 90 : 50;

    return (
      <View style={[
        styles.container,
        {
          height: this.state.isReceived ? height : 0,
          margin: this.props.margin,
          backgroundColor: this.props.backgroundColor,
        },
      ]}
      >
        <AdMobBanner
          bannerSize={this.props.bannerSize}
          adUnitID={this.props.adUnitID || config.admob[Platform.OS].banner}
          adViewDidReceiveAd={() => {
            console.log('onAdLoaded');
            this.setState({ isReceived: true });
          }}
          didFailToReceiveAdWithError={(error) => {
            console.log('onAdFailedToLoad', error);
            this.setState({ isReceivedFailed: true });
          }}
        />
      </View>
    );
  }
}

Admob.propTypes = {
  adUnitID: React.PropTypes.string,
  bannerSize: React.PropTypes.string,
  margin: React.PropTypes.number,
  backgroundColor: React.PropTypes.string,
};

Admob.defaultProps = {
  adUnitID: '',
  margin: 0,
  bannerSize: 'smartBannerPortrait',
  backgroundColor: 'white',
};

module.exports = Admob;
