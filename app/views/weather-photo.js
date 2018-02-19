import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNativeI18n from 'react-native-i18n';

import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import Admob from '../elements/admob';
import I18n from '../utils/i18n';
import tracker from '../utils/tracker';

import { config } from '../config';

const deviceLocale = ReactNativeI18n.locale;
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  body: {
    paddingTop: 20,
    alignItems: 'center',
  },
  titleBlock: {
    paddingTop: Platform.OS === 'ios' ? 60 : 10,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  titleText: {
    color: 'black',
    fontSize: 24,
  },
  text: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 30,
  },
  imageTitleText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  imageDescriptionText: {
    fontSize: 12,
    marginTop: 18,
    textAlign: 'center',
  },
  buttonBlock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2,
  },
  button: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
  },
  selectDot: {
    backgroundColor: '#424242',
  },
});

const NEW_TERRITORIES = [{
  title: 'Lau Fau Shan',
  titleHant: '流浮山',
  titleHans: '流浮山',
  description: 'Taken at Lau Fau Shan automatic weather station looking towards the west',
  descriptionHant: '在流浮山自動氣象站望向西面拍攝的照片',
  descriptionHans: '在流浮山自动气象站望向西面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/lfs/latest_LFS.jpg',
}, {
  title: 'Wetland Park',
  titleHant: '濕地公園',
  titleHans: '湿地公园',
  description: 'Taken at Wetland Park automatic weather station looking towards the northeast',
  descriptionHant: '在濕地公園自動氣象站望向東北面拍攝的照片',
  descriptionHans: '在湿地公园自动气象站望向东北面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/wlp/latest_WLP.jpg',
}, {
  title: 'Elegantia College in Sheung Shui (looking towards the northwest)',
  titleHant: '上水風采中學 (望向西北面)',
  titleHans: '上水风采中学 (望向西北面)',
  description: 'Taken at Elegantia College in Sheung Shui (looking towards the northwest)',
  descriptionHant: '在上水風采中學望向西北面拍攝的天氣照片',
  descriptionHans: '在上水风采中学望向西北面拍摄的天气照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/elc/latest_ELC.jpg',
}, {
  title: 'Kadoorie Farm and Botanic Garden',
  titleHant: '嘉道理農場暨植物園',
  titleHans: '嘉道理农场暨植物园',
  description: 'Taken at Kadoorie Farm and Botanic Garden looking towards the west',
  descriptionHant: '在嘉道理農場暨植物園遠眺新界西部拍攝的照片',
  descriptionHans: '在嘉道理农场暨植物园远眺新界西部拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/kfb/latest_KFB.jpg',
}, {
  title: 'Tai Po Kau',
  titleHant: '大埔滘',
  titleHans: '大埔滘',
  description: 'Taken at Tai Po Kau tide-gauge station looking towards the northeast',
  descriptionHant: '在大埔滘潮汐測量站望向東北面拍攝的照片',
  descriptionHans: '在大埔滘潮汐测量站望向东北面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/tpk/latest_TPK.jpg',
}, {
  title: 'Tai Lam Chung',
  titleHant: '大欖涌',
  titleHans: '大榄涌',
  description: 'Taken at Tai Lam Chung Terminal Doppler Weather Radar Station looking towards the south',
  descriptionHant: '在大欖涌的機場多普勒天氣雷達站望向南面拍攝的照片',
  descriptionHans: '在大榄涌的机场多普勒天气雷达站望向南面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/tlc/latest_TLC.jpg',
}, {
  title: 'Sai Kung Marine East Station (looking towards the northeast)',
  titleHant: '西貢水警東警署 (望向東北面)',
  titleHans: '西贡水警东警署 (望向东北面)',
  description: 'Taken at Sai Kung Marine East Station looking towards the northeast',
  descriptionHant: '在西貢水警東警署望向東北面拍攝的照片',
  descriptionHans: '在西贡水警东警署望向东北面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/sk2/latest_SK2.jpg',
}, {
  title: 'Sai Kung Marine East Station (looking towards the southeast)',
  titleHant: '西貢水警東警署 (望向東南面)',
  titleHans: '西贡水警东警署 (望向东南面)',
  description: 'Taken at Sai Kung Marine East Station looking towards the southeast',
  descriptionHant: '在西貢水警東警署望向東南面拍攝的照片',
  descriptionHans: '在西贡水警东警署望向东南面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/skg/latest_SKG.jpg',
}, {
  title: 'Clear Water Bay (looking towards the southwest)',
  titleHant: '清水灣 (望向西南面)',
  titleHans: '清水湾 (望向西南面)',
  description: 'Taken at Clear Water Bay looking towards the southwest',
  descriptionHant: '在清水灣望向西南面拍攝的照片',
  descriptionHans: '在清水湾望向西南面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/cwb/latest_CWB.jpg',
}, {
  title: 'Clear Water Bay (looking towards the east)',
  titleHant: '清水灣 (望向東面)',
  titleHans: '清水湾 (望向东面)',
  description: 'Taken at Clear Water Bay looking towards the east',
  descriptionHant: '在清水灣望向東面拍攝的照片',
  descriptionHans: '在清水湾望向东面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/cwa/latest_CWA.jpg',
}];

const KOWLOON = [{
  title: 'Kowloon City',
  titleHant: '九龍城',
  titleHans: '九龙城',
  description: 'Taken at Kowloon City looking towards the southeast',
  descriptionHant: '在九龍城望向東南面拍攝的照片',
  descriptionHans: '在九龙城望向东南面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/klt/latest_KLT.jpg',
}, {
  title: 'Tsim Sha Tsui (looking towards the west)',
  titleHant: '尖沙咀 (望向西面)',
  titleHans: '尖沙咀 (望向西面)',
  description: 'Taken at the Hong Kong Observatory Headquarters at Tsim Sha Tsui looking towards the west',
  descriptionHant: '在尖沙咀香港天文台總部望向西面拍攝的照片',
  descriptionHans: '在尖沙咀香港天文台总部望向西面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/hk2/latest_HK2.jpg',
}, {
  title: 'Tsim Sha Tsui (looking towards the east)',
  titleHant: '尖沙咀 (望向東面)',
  titleHans: '尖沙咀 (望向东面)',
  description: 'Taken at the Hong Kong Observatory Headquarters at Tsim Sha Tsui looking towards the east',
  descriptionHant: '在尖沙咀香港天文台總部望向東面拍攝的照片',
  descriptionHans: '在尖沙咀香港天文台总部望向东面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/hko/latest_HKO.jpg',
}];

const HONGKONG = [{
  title: 'Central',
  titleHant: '中環',
  titleHans: '中环',
  description: 'Taken at Central Pier automatic weather station looking towards the east',
  descriptionHant: '在中環碼頭自動氣象站望向東面拍攝的照片',
  descriptionHans: '在中环码头自动气象站望向东面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/cp1/latest_CP1.jpg',
}, {
  title: 'Victoria Peak (looking towards the north-northeast)',
  titleHant: '太平山(望向東北偏北面)',
  titleHans: '太平山(望向东北偏北面)',
  description: 'Taken at Victoria Peak looking towards the north-northeast',
  descriptionHant: '在太平山望向東北偏北面拍攝的照片',
  descriptionHans: '在太平山望向东北偏北面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/vpb/latest_VPB.jpg',
}, {
  title: 'Victoria Peak (looking towards the east)',
  titleHant: '太平山 (望向東面)',
  titleHans: '太平山 (望向东面)',
  description: 'Taken at Victoria Peak looking towards the east',
  descriptionHant: '在太平山望向東面拍攝的照片',
  descriptionHans: '在太平山望向东面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/vpa/latest_VPA.jpg',
}, {
  title: 'German Swiss International School',
  titleHant: '德瑞國際學校',
  titleHans: '德瑞国际学校',
  description: 'Taken at German Swiss International School looking towards the south',
  descriptionHant: '在德瑞國際學校望向南面拍攝的照片',
  descriptionHans: '在德瑞国际学校望向南面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/gsi/latest_GSI.jpg',
}, {
  title: 'Sai Wan Ho',
  titleHant: '西灣河',
  titleHans: '西湾河',
  description: 'Taken at Sai Wan Ho Automatic Weather Station looking towards the east',
  descriptionHant: '在西灣河自動氣象站望向東面拍攝的照片',
  descriptionHans: '在西湾河自动气象站望向东面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/swh/latest_SWH.jpg',
}];

const LANTAU_AND_OTHER_ISLANDS = [{
  title: 'Sha Lo Wan',
  titleHant: '沙螺灣',
  titleHans: '沙螺湾',
  description: 'Taken at Sha Lo Wan Wind Profiler Station looking towards the northeast',
  descriptionHant: '在沙螺灣氣流剖析儀站望向東北面拍攝的照片',
  descriptionHans: '在沙螺湾气流剖析仪站望向东北面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/slw/latest_SLW.jpg',
}, {
  title: 'Peng Chau (overlooking Penny\'s Bay)',
  titleHant: '坪洲 (遠眺竹篙灣)',
  titleHans: '坪洲 (远眺竹篙湾)',
  description: 'Taken at Peng Chau automatic weather station. In the photo, Disneyland is on the left.',
  descriptionHant: '在坪洲自動氣象站拍攝的照片。迪士尼樂園位於照片的左方。',
  descriptionHans: '在坪洲自动气象站拍摄的照片。迪士尼乐园位于照片的左方。',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/dnl/latest_DNL.jpg',
}, {
  title: 'Peng Chau (overlooking Victoria Harbour)',
  titleHant: '坪洲(遠眺維多利亞港)',
  titleHans: '坪洲(远眺维多利亚港)',
  description: 'Taken at Peng Chau automatic weather station looking towards the east',
  descriptionHant: '在坪洲自動氣象站望向東面拍攝的照片',
  descriptionHans: '在坪洲自动气象站望向东面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/pe2/latest_PE2.jpg',
}, {
  title: 'Cheung Chau',
  titleHant: '長洲',
  titleHans: '长洲',
  description: 'Taken at Cheung Chau automatic weather station looking towards the north',
  descriptionHant: '在長洲自動氣象站望向北面拍攝的照片',
  descriptionHans: '在长洲自动气象站望向北面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/cch/latest_CCH.jpg',
}, {
  title: 'Cheung Chau Tung Wan',
  titleHant: '長洲東灣',
  titleHans: '长洲东湾',
  description: 'Taken at Cheung Chau Sacred Heart School looking towards the east',
  descriptionHant: '在長洲聖心學校望向東面拍攝的照片',
  descriptionHans: '在长洲圣心学校望向东面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/cce/latest_CCE.jpg',
}, {
  title: 'Lamma Island',
  titleHant: '南丫島',
  titleHans: '南丫岛',
  description: 'Taken at Lamma Island Yung Shue Wan Pier looking towards the northwest',
  descriptionHant: '在南丫島望向西北面拍攝的天氣照片',
  descriptionHans: '在南丫岛望向西北面拍摄的天气照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/lam/latest_LAM.jpg',
}, {
  title: 'Waglan Island (looking towards the north-northwest)',
  titleHant: '橫瀾島 (望向西北偏北面)',
  titleHans: '横澜岛 (望向西北偏北面)',
  description: 'Taken at Waglan Island automatic weather station looking towards the north-northwest',
  descriptionHant: '在橫瀾島自動氣象站望向西北偏北面拍攝的照片',
  descriptionHans: '在横澜岛自动气象站望向西北偏北面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/wl2/latest_WL2.jpg',
}, {
  title: 'Waglan Island (looking towards the west)',
  titleHant: '橫瀾島 (望向西面)',
  titleHans: '横澜岛 (望向西面)',
  description: 'Taken at Waglan Island automatic weather station looking towards the west',
  descriptionHant: '在橫瀾島自動氣象站望向西面拍攝的照片',
  descriptionHans: '在横澜岛自动气象站望向西面拍摄的照片',
  uri: 'http://www.hko.gov.hk/wxinfo/aws/hko_mica/wgl/latest_WGL.jpg',
}];

export default class ForecastModal extends Component {
  static navigationOptions = {
    header: null,
    title: 'Photo',
    tabBarLabel: I18n.t('weather_photo'),
    tabBarIcon: ({ tintColor }) => (
      <Icon name="collections" size={19} color={tintColor || 'gray'} />
    ),
  };

  state = {
    distinct: NEW_TERRITORIES,
  }

  componentDidMount() {
    Image.getSize(NEW_TERRITORIES[0].uri, (imageWidth, imageHeight) => {
      console.log('getSize', imageWidth, imageHeight);
      this.setState({ ratio: imageHeight / imageWidth });
    });
  }

  selectDistinct(distinct) {
    this.setState({ distinct, random: Math.random() }, () => {
      switch (distinct) {
        case NEW_TERRITORIES:
          tracker.logEvent('select-distinct', { label: 'NEW_TERRITORIES' });
          break;
        case KOWLOON:
          tracker.logEvent('select-distinct', { label: 'KOWLOON' });
          break;
        case HONGKONG:
          tracker.logEvent('select-distinct', { label: 'HONGKONG' });
          break;
        case LANTAU_AND_OTHER_ISLANDS:
          tracker.logEvent('select-distinct', { label: 'LANTAU_AND_OTHER_ISLANDS' });
          break;
        default:
          break;
      }
    });
  }

  render() {
    tracker.view('Weather Photo');

    if (deviceLocale.startsWith('zh-Hans')) {
      lang = 'Hans';
    } else if (deviceLocale.startsWith('zh')) {
      lang = 'Hant';
    } else {
      lang = '';
    }

    return (
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>{I18n.t('weather_photo_title')}</Text>
        </View>
        <IndicatorViewPager
          key={`${this.state.ratio}${this.state.random}`}
          style={{ flex: 1 }}
          indicator={<PagerDotIndicator selectedDotStyle={styles.selectDot} pageCount={this.state.distinct.length} />}
        >
          {this.state.distinct.map(item => (
            <View key={`photo-${item.title}`} style={styles.body}>
              <Image
                style={{ width, height: this.state.ratio * width }}
                source={{ uri: item.uri }}
              />
              <View style={{ padding: 10 }}>
                <Text style={styles.imageTitleText}>{item[`title${lang}`]}</Text>
                <Text style={styles.imageDescriptionText}>{item[`description${lang}`]}</Text>
              </View>
            </View>))}
        </IndicatorViewPager>

        <View style={styles.buttonBlock}>
          <TouchableHighlight
            style={[styles.button, { borderColor: this.state.distinct === NEW_TERRITORIES ? '#29B6F6' : '#EEEEEE' }]}
            onPress={() => this.selectDistinct(NEW_TERRITORIES)}
            underlayColor="#EEEEEE"
          >
            {(() => {
              switch (lang) {
                case 'Hant':
                  return <Text style={styles.buttonText}>新 界</Text>;
                case 'Hans':
                  return <Text style={styles.buttonText}>新 界</Text>;
                default:
                  return <Text style={styles.buttonText}>N.T.</Text>;
              }
            })()}
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, { borderColor: this.state.distinct === KOWLOON ? '#29B6F6' : '#EEEEEE' }]}
            onPress={() => this.selectDistinct(KOWLOON)}
            underlayColor="#EEEEEE"
          >
            {(() => {
              switch (lang) {
                case 'Hant':
                  return <Text style={styles.buttonText}>九 龍</Text>;
                case 'Hans':
                  return <Text style={styles.buttonText}>九 龙</Text>;
                default:
                  return <Text style={styles.buttonText}>KLN</Text>;
              }
            })()}
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, { borderColor: this.state.distinct === HONGKONG ? '#29B6F6' : '#EEEEEE' }]}
            onPress={() => this.selectDistinct(HONGKONG)}
            underlayColor="#EEEEEE"
          >
            {(() => {
              switch (lang) {
                case 'Hant':
                  return <Text style={styles.buttonText}>香 港 島</Text>;
                case 'Hans':
                  return <Text style={styles.buttonText}>香 港 島</Text>;
                default:
                  return <Text style={styles.buttonText}>HK</Text>;
              }
            })()}
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, { borderColor: this.state.distinct === LANTAU_AND_OTHER_ISLANDS ? '#29B6F6' : '#EEEEEE' }]}
            onPress={() => this.selectDistinct(LANTAU_AND_OTHER_ISLANDS)}
            underlayColor="#EEEEEE"
          >
            {(() => {
              switch (lang) {
                case 'Hant':
                  return <Text style={styles.buttonText}>大嶼山及離島</Text>;
                case 'Hans':
                  return <Text style={styles.buttonText}>大屿山及离岛</Text>;
                default:
                  return <Text style={styles.buttonText}>Others</Text>;
              }
            })()}
          </TouchableHighlight>
        </View>

        <Admob adUnitID={config.admob[`hkaqi-photos-${Platform.OS}-footer`]} />
      </View>
    );
  }
}
