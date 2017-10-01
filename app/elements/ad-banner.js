import React from 'react';
import {
  Platform,
} from 'react-native';

import { BannerView } from 'react-native-fbads';
import Admob from './admob';

import { config } from '../config';

export default class AdBanner extends React.Component {
  state = {
    adType: Math.random() < 0.5 ? 'FBADS' : 'ADMOB',
  };

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
