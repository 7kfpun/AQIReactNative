import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import * as StoreReview from 'react-native-store-review';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';

import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    margin: 15,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
  },
  button: {
    marginTop: 6,
    padding: 10,
    backgroundColor: '#3B5998',
    borderRadius: 2,
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
  close: {
    position: 'absolute',
    top: 6,
    right: 10,
  },
});

const STARS_TO_APP_STORE = 4;

export default class Rating extends React.Component {
  static openFeedbackUrl() {
    const url = 'https://goo.gl/forms/LebZHLZK33CxAkSz1';
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      starCount: 0,
      isRatingGiven: false,
      isRatingClose: false,
    };
  }

  componentDidMount() {
    const that = this;
    store.get('isRatingGiven').then((isRatingGiven) => {
      if (isRatingGiven) {
        that.setState({ isRatingGiven });
      }
    });
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });

    if (rating >= STARS_TO_APP_STORE) {
      if (StoreReview.isAvailable) {
        StoreReview.requestReview();
      } else if (Platform.OS === 'ios') {
        Linking.openURL('itms-apps://itunes.apple.com/app/id1195271547');
      } else if (Platform.OS === 'android') {
        Linking.openURL('market://details?id=com.kfpun.aqi');
      }
    }

    store.save('isRatingGiven', true);

    tracker.trackEvent('user-action', 'give-rating', { label: rating.toString() });
  }

  render() {
    if (!this.state.isRatingGiven && !this.state.isRatingClose) {
      return (<Animatable.View style={styles.container} animation="fadeIn" delay={500}>
        <TouchableOpacity style={styles.close} onPress={() => this.setState({ isRatingClose: true })}>
          <Icon name="clear" size={16} color="#616161" />
        </TouchableOpacity>
        <Icon name="thumb-up" size={26} color="#616161" />
        <Text>{I18n.t('rating_description')}</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          starSize={28}
          rating={this.state.starCount}
          selectedStar={rating => this.onStarRatingPress(rating)}
        />
        {this.state.starCount > 0
        && this.state.starCount < STARS_TO_APP_STORE
        && <TouchableOpacity onPress={() => Rating.openFeedbackUrl()}>
          <Animatable.View style={styles.button} animation="fadeIn">
            <Text style={styles.text}>{I18n.t('feedback_description')}</Text>
          </Animatable.View>
        </TouchableOpacity>}
      </Animatable.View>);
    }

    return null;
  }
}
