import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    notify_title: 'Settings',
    notify_pollution_title: 'Notice me when the air quality gets significantly worse',
    notify_pollution_location: 'Pick a location',
    notify_pollution_therhold: 'Notice me when AQI is above',
    notify_cleanliness_title: 'Notice me when the air gets clean',
    notify_cleanliness_location: 'Pick a location',
    notify_cleanliness_therhold: 'Notice me when AQI is below',
    aqi_full: 'Air Quality Index (AQI)',
    aqhi_full: 'Air Quality Health Index (AQHI)',
    last_update: 'Last Updated On',
    permissions_required: 'Notification permissions required',
    too_small_therhold: 'The value is too small, you would get lots of notifications',
    too_large_therhold: 'The value is too large, you would get lots of notifications',
    rating_description: 'Enjoying HK AQI?',
    feedback_description: 'Give us a feedback',
    forecast_of_health_risk: 'FORECAST of Health Risk',
    general_stations: 'General Stations',
    roadside_stations: 'Roadside Stations',
    tomorrow_am: 'A.M.',
    tomorrow_pm: 'P.M.',
  },
  zh: {
    notify_title: '空氣質量通知',
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
    rating_description: '喜歡「HK AQI」嗎？',
    feedback_description: '請給我們一些意見',
    forecast_of_health_risk: '預測 - 健康風險',
    general_stations: '一般監測站',
    roadside_stations: '路邊監測站',
    tomorrow_am: '上午',
    tomorrow_pm: '下午',
  },
  'zh-Hans': {
    notify_title: '空气质量通知',
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
    rating_description: '喜欢「HK AQI」吗？',
    feedback_description: '请给我们一些意见',
    forecast_of_health_risk: '预测 - 健康风险',
    general_stations: '一般监测站',
    roadside_stations: '路边监测站',
    tomorrow_am: '上午',
    tomorrow_pm: '下午',
  },
};

I18n.translations['zh-Hans-US'] = I18n.translations['zh-Hans'];
I18n.translations['zh-Hans-HK'] = I18n.translations['zh-Hans'];
I18n.translations['zh-Hans-MN'] = I18n.translations['zh-Hans'];

export default I18n;
