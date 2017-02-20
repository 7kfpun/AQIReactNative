import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    notify_title: 'Notify me when the air quality gets significantly worse',
    notify_location: 'Pick a location',
    notify_therhold: 'Notify me when AQI is above',
    aqi_full: 'Air Quality Index (AQI)',
    aqhi_full: 'Air Quality Health Index (AQHI)',
    last_update: 'Last Updated On',
  },
  zh: {
    notify_title: '當空氣質量明顯惡化時通知我',
    notify_location: '選擇地區',
    notify_therhold: 'AQI 指數超過',
    aqi_full: '空氣質素指數（AQI）',
    aqhi_full: '空氣質素健康指數（AQHI）',
    last_update: '更新時間',
  },
  'zh-CN': {
    notify_title: '当空气质量明显恶化时通知我',
    notify_location: '选择地区',
    notify_therhold: 'AQI 指数超过',
    aqi_full: '空气质素指数（AQI）',
    aqhi_full: '空气质素健康指数（AQHI）',
    last_update: '更新时间',
  },
};

export default I18n;
