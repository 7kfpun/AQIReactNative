import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    main: 'Map',
    details: 'Details',
    weather_photo: 'Photos',
    weather_photo_title: 'Weather Photo',
    settings: 'Notification',
    help: 'Help',
    forecast: 'Forecast',
    notify_title: 'Notification',
    notify_pollution_title: 'Notice me when the air quality gets significantly worse',
    notify_pollution_location: 'Pick a location',
    notify_pollution_therhold: 'Notice me when AQI is above',
    notify_cleanliness_title: 'Notice me when the air gets clean',
    notify_cleanliness_location: 'Pick a location',
    notify_cleanliness_therhold: 'Notice me when AQI is below',
    aqi_full: 'Air Quality Index (AQI)',
    aqhi_full: 'Air Quality Health Index (AQHI)',
    last_update: 'Last Updated On',
    permissions_required: 'Notification permission required',
    too_small_therhold: 'The value is too small, you would get lots of notifications',
    too_large_therhold: 'The value is too large, you would get lots of notifications',
    rating_title: 'Enjoy using HK AQI?',
    rating_description: 'Please give us 5 stars to cheer we up if you like this app.',
    feedback_description: 'Give us some feedbacks. We will definitely keep improving.',
    forecast_of_health_risk: 'Forecast of Health Risk',
    general_stations: 'General Stations',
    roadside_stations: 'Roadside Stations',
    tomorrow_am: 'A.M.',
    tomorrow_pm: 'P.M.',
    status_good: 'Good',
    status_moderate: 'Moderate',
    status_unhealthy_for_sensitive_groups: 'Unhealthy for high-risk group',
    status_unhealthy: 'Unhealthy',
    status_very_unhealthy: 'Very Unhealthy',
    status_hazardous: 'Hazardous',
  },
  zh: {
    main: '地圖',
    details: '詳細',
    weather_photo: '天氣照片',
    weather_photo_title: '天氣照片',
    settings: '通知設定',
    help: '幫助',
    forecast: '預測',
    notify_title: '空氣質素通知',
    notify_pollution_title: '當空氣質素明顯惡化時通知我',
    notify_pollution_location: '選擇地區',
    notify_pollution_therhold: 'AQI 指數超過',
    notify_cleanliness_title: '當空氣質素優良時通知我',
    notify_cleanliness_location: '選擇地區',
    notify_cleanliness_therhold: 'AQI 指數低於',
    aqi_full: '空氣質素指數（AQI）',
    aqhi_full: '空氣質素健康指數（AQHI）',
    last_update: '更新時間',
    permissions_required: '請允許通知以獲取最新空氣質素報告',
    too_small_therhold: '您所設定的值偏低，或會收到很多通知',
    too_large_therhold: '您所設定的值偏高，或會收到很多通知',
    rating_title: '喜歡「HK AQI」嗎？',
    rating_description: '請給我們 5 顆星鼓勵我們',
    feedback_description: '我們很需要您的建議，讓我們越做越好。',
    forecast_of_health_risk: '預測 - 健康風險',
    general_stations: '一般監測站',
    roadside_stations: '路邊監測站',
    tomorrow_am: '上午',
    tomorrow_pm: '下午',
    status_good: '良好',
    status_moderate: '一般',
    status_unhealthy_for_sensitive_groups: '對高危人士不健康',
    status_unhealthy: '不健康',
    status_very_unhealthy: '非常不健康',
    status_hazardous: '危害',
  },
  'zh-Hans': {
    main: '地图',
    details: '详细',
    weather_photo: '天氣照片',
    weather_photo_title: '天氣照片',
    settings: '通知设定',
    help: '帮助',
    forecast: '预测',
    notify_title: '空气质素通知',
    notify_pollution_title: '当空气质素明显恶化时通知我',
    notify_pollution_location: '选择地区',
    notify_pollution_therhold: 'AQI 指数超过',
    notify_cleanliness_title: '当空气质素优良时通知我',
    notify_cleanliness_location: '选择地区',
    notify_cleanliness_therhold: 'AQI 指数低于',
    aqi_full: '空气质素指数（AQI）',
    aqhi_full: '空气质素健康指数（AQHI）',
    last_update: '更新时间',
    permissions_required: '请允许通知以获取最新空气质素报告',
    too_small_therhold: '您所设定的值偏低，或会收到很多通知',
    too_large_therhold: '您所设定的值偏高，或会收到很多通知',
    rating_title: '喜欢「HK AQI」吗？',
    rating_description: '请给我们 5 颗星鼓励我们',
    feedback_description: '我们很需要您的点建议，让我们越做越好。',
    forecast_of_health_risk: '预测 - 健康风险',
    general_stations: '一般监测站',
    roadside_stations: '路边监测站',
    tomorrow_am: '上午',
    tomorrow_pm: '下午',
    status_good: '良好',
    status_moderate: '一般',
    status_unhealthy_for_sensitive_groups: '对高危人士不健康',
    status_unhealthy: '不健康',
    status_very_unhealthy: '非常不健康',
    status_hazardous: '危害',
  },
};

I18n.translations['zh-Hans-HK'] = I18n.translations['zh-Hans'];
I18n.translations['zh-Hans-MN'] = I18n.translations['zh-Hans'];
I18n.translations['zh-Hans-US'] = I18n.translations['zh-Hans'];
I18n.translations['zh-Hant-HK'] = I18n.translations.zh;
I18n.translations['zh-Hant-MN'] = I18n.translations.zh;
I18n.translations['zh-Hant-US'] = I18n.translations.zh;

I18n.isZh = I18n.locale.startsWith('zh');

export default I18n;
