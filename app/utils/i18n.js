import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    notify_pollution_title: 'Notify me when the air quality gets significantly worse',
    notify_pollution_location: 'Pick a location',
    notify_pollution_therhold: 'Notify me when AQI is above',
    notify_cleanliness_title: 'Notify me when the air gets clean',
    notify_cleanliness_location: 'Pick a location',
    notify_cleanliness_therhold: 'Notify me when AQI is below',
    aqi_full: 'Air Quality Index (AQI)',
    aqhi_full: 'Air Quality Health Index (AQHI)',
    last_update: 'Last Updated On',
    permissions_required: 'Notification permissions required',
    too_small_therhold: 'The value is too small, you would get lots of notifications',
    too_large_therhold: 'The value is too large, you would get lots of notifications',
  },
  zh: {
    notify_pollution_title: '當空氣質量明顯惡化時通知我',
    notify_pollution_location: '選擇地區',
    notify_pollution_therhold: 'AQI 指數超過',
    notify_cleanliness_title: '當空氣質量優良時通知我',
    notify_cleanliness_location: '選擇地區',
    notify_cleanliness_therhold: 'AQI 指數低於',
    aqi_full: '空氣質素指數（AQI）',
    aqhi_full: '空氣質素健康指數（AQHI）',
    last_update: '更新時間',
    permissions_required: '請允許通知',
    too_small_therhold: '您所設定的值偏低，或會收到很多通知',
    too_large_therhold: '您所設定的值偏高，或會收到很多通知',
  },
  'zh-CN': {
    notify_pollution_title: '当空气质量明显恶化时通知我',
    notify_pollution_location: '选择地区',
    notify_pollution_therhold: 'AQI 指数超过',
    notify_cleanliness_title: '当空气质量优良时通知我',
    notify_cleanliness_location: '选择地区',
    notify_cleanliness_therhold: 'AQI 指数低于',
    aqi_full: '空气质素指数（AQI）',
    aqhi_full: '空气质素健康指数（AQHI）',
    last_update: '更新时间',
    permissions_required: '请允许通知',
    too_small_therhold: '您所设定的值偏低，或会收到很多通知',
    too_large_therhold: '您所设定的值偏高，或会收到很多通知',
  },
};

export default I18n;
