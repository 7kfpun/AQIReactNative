import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeI18n from 'react-native-i18n';

import AdBanner from '../elements/ad-banner';
import Chart from '../elements/chart';
import SettingsItem from '../elements/settings-item';

import { history } from '../utils/api';
import { indexTypes } from '../utils/indexes';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

const deviceLocale = ReactNativeI18n.locale;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingLeft: 2,
    marginBottom: 10,
  },
  block: {
    marginLeft: 10,
    paddingRight: 10,
    paddingVertical: 20,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    color: 'black',
    marginLeft: 2,
  },
  text: {
    fontSize: 14,
    color: 'black',
  },
  amountText: {
    fontSize: 14,
    color: 'gray',
  },
  dateText: {
    fontSize: 10,
  },
});

export default class DetailsView extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({}).isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  }

  static navigationOptions = () => ({
    header: null,
    tabBarLabel: I18n.t('details'),
    tabBarIcon: ({ tintColor }) => (<Icon
      name="timeline"
      size={21}
      color={tintColor}
    />),
  })

  state = {
    refreshing: true,
  }

  componentDidMount() {
    this.prepareData();

    const { state } = this.props.navigation;
    const { item } = state.params;
  }

  prepareData = () => {
    const { state } = this.props.navigation;
    const { item } = state.params;

    history(item.title).then((result) => {
      console.log(result);
      if (result.history) {
        this.setState({ result });
      }
      this.setState({ refreshing: false });
    });
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  }

  render() {
    const { state } = this.props.navigation;
    const { item } = state.params;

    let { title } = item;
    if (deviceLocale.startsWith('zh-Hans')) {
      title = item.title_hans;
    } else if (deviceLocale.startsWith('zh')) {
      title = item.title_hant;
    }

    tracker.view('History-Details');
    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Icon name="chevron-left" size={40} color="gray" onPress={this.goBack} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.prepareData}
            />
          }
        >
          {!this.state.refreshing &&
            <View style={{ padding: 10 }}>
              <SettingsItem
                text={I18n.t('notify_title')}
                item={item}
                tags={this.state.tags || {}}
              />
            </View>}
          {!this.state.refreshing && indexTypes.map((indexType) => {
            const { length } = this.state.result.history;
            return (
              <View key={indexType.key} style={styles.block}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.text}>{indexType.name}</Text>
                  <Text style={styles.amountText}>{`${this.state.result.history[length - 1][indexType.key]}${indexType.unit ? ` ${indexType.unit}` : ''}`}</Text>
                </View>

                <Chart result={this.state.result} index={indexType.key} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.dateText}>{this.state.result.history[0].time}</Text>
                  <Text style={styles.dateText}>{this.state.result.history[length - 1].time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <AdBanner adUnitID="hkaqi-details-ios-footer" />
      </View>
    );
  }
}
