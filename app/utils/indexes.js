import I18n from './i18n';

exports.indexTypes = [
  {
    key: 'AQI',
    name: 'AQI',
    unit: '',
    isShownDetails: true,
  },
  {
    key: 'AQHI',
    name: 'AQHI',
    unit: '',
    isShownDetails: true,
  },
  {
    key: 'PM2_5',
    name: 'PM2.5',
    unit: '(μg/m3)',
    isShownDetails: true,
  },
  {
    key: 'PM10',
    name: 'PM10',
    unit: '(μg/m3)',
    isShownDetails: true,
  },
  {
    key: 'O3',
    name: 'O3',
    unit: '(ppb)',
  },
  {
    key: 'CO',
    name: 'CO',
    unit: '(ppm)',
  },
  {
    key: 'SO2',
    name: 'SO2',
    unit: '(ppb)',
  },
  {
    key: 'NO2',
    name: 'NO2',
    unit: '(ppb)',
  },
];

// 0-50 Good Air pollution risk is low.
// 51-100 Moderate Air quality is acceptable.
// 101-150 Unhealthy for high-risk group High-risk group may have health effects. General public is not affected.
// 151-200 Unhealthy High-risk group may have more serious health effects. Some of the general public may have health effects.
// 201-300 Very Unhealthy General public have health effects.
// 301-500 Hazardous Some of the general public may have more serious health effects.
const indexRanges = {
  AQI: [
    {
      key: 0,
      status: I18n.t('status_good'),
      image: require('../res/status_good.png'),
      color: '#009866',
      fontColor: 'white',
      min: 0,
      max: 50,
    },
    {
      key: 1,
      status: I18n.t('status_moderate'),
      image: require('../res/status_moderate.png'),
      color: '#FEDE33',
      fontColor: 'black',
      min: 51,
      max: 100,
    },
    {
      key: 2,
      status: I18n.t('status_unhealthy_for_sensitive_groups'),
      image: require('../res/status_unhealthy_for_sensitive_groups.png'),
      color: '#FE9833',
      fontColor: 'black',
      min: 101,
      max: 150,
    },
    {
      key: 3,
      status: I18n.t('status_unhealthy'),
      image: require('../res/status_unhealthy.png'),
      color: '#CC0033',
      fontColor: 'white',
      min: 151,
      max: 200,
    },
    {
      key: 4,
      status: I18n.t('status_very_unhealthy'),
      image: require('../res/status_very_unhealthy.png'),
      color: '#660098',
      fontColor: 'white',
      min: 201,
      max: 300,
    },
    {
      key: 5,
      status: I18n.t('status_hazardous'),
      image: require('../res/status_hazardous.png'),
      color: '#7E2200',
      fontColor: 'white',
      min: 301,
      max: 500,
    },
  ],

  AQHI: [
    {
      key: 0,
      status: I18n.t('status_good'),
      image: require('../res/status_good.png'),
      color: '#4DB748',
      fontColor: 'white',
      min: Number.NEGATIVE_INFINITY,
      max: 3,
    },
    {
      key: 1,
      status: I18n.t('status_moderate'),
      image: require('../res/status_moderate.png'),
      color: '#F9AB1A',
      fontColor: 'black',
      min: 4,
      max: 6,
    },
    {
      key: 2,
      status: I18n.t('status_unhealthy_for_sensitive_groups'),
      image: require('../res/status_unhealthy_for_sensitive_groups.png'),
      color: '#ED1B24',
      fontColor: 'white',
      min: 7,
      max: 7,
    },
    {
      key: 3,
      status: I18n.t('status_unhealthy'),
      image: require('../res/status_unhealthy.png'),
      color: '#A04623',
      fontColor: 'white',
      min: 8,
      max: 10,
    },
    {
      key: 4,
      status: I18n.t('status_very_unhealthy'),
      image: require('../res/status_very_unhealthy.png'),
      color: '#000000',
      fontColor: 'white',
      min: 10,
      max: Number.POSITIVE_INFINITY,
    },
  ],

  'PM2.5': [
    {
      key: 0,
      status: I18n.t('status_good'),
      image: require('../res/status_good.png'),
      color: '#009866',
      fontColor: 'white',
      min: 0.0,
      max: 15.49,
    },
    {
      key: 1,
      status: I18n.t('status_moderate'),
      image: require('../res/status_moderate.png'),
      color: '#FEDE33',
      fontColor: 'black',
      min: 15.5,
      max: 35.49,
    },
    {
      key: 2,
      status: I18n.t('status_unhealthy_for_sensitive_groups'),
      image: require('../res/status_unhealthy_for_sensitive_groups.png'),
      color: '#FE9833',
      fontColor: 'black',
      min: 35.5,
      max: 54.49,
    },
    {
      key: 3,
      status: I18n.t('status_unhealthy'),
      image: require('../res/status_unhealthy.png'),
      color: '#CC0033',
      fontColor: 'white',
      min: 54.5,
      max: 150.49,
    },
    {
      key: 4,
      status: I18n.t('status_very_unhealthy'),
      image: require('../res/status_very_unhealthy.png'),
      color: '#660098',
      fontColor: 'white',
      min: 150.5,
      max: 250.49,
    },
    {
      key: 5,
      status: I18n.t('status_hazardous'),
      image: require('../res/status_hazardous.png'),
      color: '#7E2200',
      fontColor: 'white',
      min: 250.5,
      max: Number.MAX_SAFE_INTEGER,
    },
  ],

  PM10: [
    {
      key: 0,
      status: I18n.t('status_good'),
      image: require('../res/status_good.png'),
      color: '#009866',
      fontColor: 'white',
      min: 0,
      max: 54.9,
    },
    {
      key: 1,
      status: I18n.t('status_moderate'),
      image: require('../res/status_moderate.png'),
      color: '#FEDE33',
      fontColor: 'black',
      min: 55,
      max: 125.9,
    },
    {
      key: 2,
      status: I18n.t('status_unhealthy_for_sensitive_groups'),
      image: require('../res/status_unhealthy_for_sensitive_groups.png'),
      color: '#FE9833',
      fontColor: 'black',
      min: 126,
      max: 254.9,
    },
    {
      key: 3,
      status: I18n.t('status_unhealthy'),
      image: require('../res/status_unhealthy.png'),
      color: '#CC0033',
      fontColor: 'white',
      min: 255,
      max: 354.9,
    },
    {
      key: 4,
      status: I18n.t('status_very_unhealthy'),
      image: require('../res/status_very_unhealthy.png'),
      color: '#660098',
      fontColor: 'white',
      min: 355,
      max: 424.9,
    },
    {
      key: 5,
      status: I18n.t('status_hazardous'),
      image: require('../res/status_hazardous.png'),
      color: '#7E2200',
      fontColor: 'white',
      min: 425,
      max: Number.MAX_SAFE_INTEGER,
    },
  ],

  O3: [
    {
      key: 0,
      status: I18n.t('status_good'),
      image: require('../res/status_good.png'),
      color: '#009866',
      fontColor: 'white',
      min: 0,
      max: 54.9,
    },
    {
      key: 1,
      status: I18n.t('status_moderate'),
      image: require('../res/status_moderate.png'),
      color: '#FEDE33',
      fontColor: 'black',
      min: 55,
      max: 125.9,
    },
    {
      key: 2,
      status: I18n.t('status_unhealthy_for_sensitive_groups'),
      image: require('../res/status_unhealthy_for_sensitive_groups.png'),
      color: '#FE9833',
      fontColor: 'black',
      min: 125,
      max: 164.9,
    },
    {
      key: 3,
      status: I18n.t('status_unhealthy'),
      image: require('../res/status_unhealthy.png'),
      color: '#CC0033',
      fontColor: 'white',
      min: 165,
      max: 204.9,
    },
    {
      key: 4,
      status: I18n.t('status_very_unhealthy'),
      image: require('../res/status_very_unhealthy.png'),
      color: '#660098',
      fontColor: 'white',
      min: 205,
      max: 404.9,
    },
    {
      key: 5,
      status: I18n.t('status_hazardous'),
      image: require('../res/status_hazardous.png'),
      color: '#7E2200',
      fontColor: 'white',
      min: 405,
      max: Number.MAX_SAFE_INTEGER,
    },
  ],

  CO: [
    {
      key: 0,
      status: I18n.t('status_good'),
      image: require('../res/status_good.png'),
      color: '#009866',
      fontColor: 'white',
      min: 0,
      max: 4.49,
    },
    {
      key: 1,
      status: I18n.t('status_moderate'),
      image: require('../res/status_moderate.png'),
      color: '#FEDE33',
      fontColor: 'black',
      min: 4.5,
      max: 9.49,
    },
    {
      key: 2,
      status: I18n.t('status_unhealthy_for_sensitive_groups'),
      image: require('../res/status_unhealthy_for_sensitive_groups.png'),
      color: '#FE9833',
      fontColor: 'black',
      min: 9.5,
      max: 12.49,
    },
    {
      key: 3,
      status: I18n.t('status_unhealthy'),
      image: require('../res/status_unhealthy.png'),
      color: '#CC0033',
      fontColor: 'white',
      min: 12.5,
      max: 15.49,
    },
    {
      key: 4,
      status: I18n.t('status_very_unhealthy'),
      image: require('../res/status_very_unhealthy.png'),
      color: '#660098',
      fontColor: 'white',
      min: 15.5,
      max: 30.49,
    },
    {
      key: 5,
      status: I18n.t('status_hazardous'),
      image: require('../res/status_hazardous.png'),
      color: '#7E2200',
      fontColor: 'white',
      min: 30.5,
      max: Number.MAX_SAFE_INTEGER,
    },
  ],

  SO2: [
    {
      key: 0,
      status: I18n.t('status_good'),
      image: require('../res/status_good.png'),
      color: '#009866',
      fontColor: 'white',
      min: 0,
      max: 35.9,
    },
    {
      key: 1,
      status: I18n.t('status_moderate'),
      image: require('../res/status_moderate.png'),
      color: '#FEDE33',
      fontColor: 'black',
      min: 36,
      max: 75.9,
    },
    {
      key: 2,
      status: I18n.t('status_unhealthy_for_sensitive_groups'),
      image: require('../res/status_unhealthy_for_sensitive_groups.png'),
      color: '#FE9833',
      fontColor: 'black',
      min: 76,
      max: 185.9,
    },
    {
      key: 3,
      status: I18n.t('status_unhealthy'),
      image: require('../res/status_unhealthy.png'),
      color: '#CC0033',
      fontColor: 'white',
      min: 186,
      max: 304.9,
    },
    {
      key: 4,
      status: I18n.t('status_very_unhealthy'),
      image: require('../res/status_very_unhealthy.png'),
      color: '#660098',
      fontColor: 'white',
      min: 305,
      max: 604.9,
    },
    {
      key: 5,
      status: I18n.t('status_hazardous'),
      image: require('../res/status_hazardous.png'),
      color: '#7E2200',
      fontColor: 'white',
      min: 605,
      max: Number.MAX_SAFE_INTEGER,
    },
  ],

  NO2: [
    {
      key: 0,
      status: I18n.t('status_good'),
      image: require('../res/status_good.png'),
      color: '#009866',
      fontColor: 'white',
      min: 0,
      max: 53.9,
    },
    {
      key: 1,
      status: I18n.t('status_moderate'),
      image: require('../res/status_moderate.png'),
      color: '#FEDE33',
      fontColor: 'black',
      min: 54,
      max: 100.9,
    },
    {
      key: 2,
      status: I18n.t('status_unhealthy_for_sensitive_groups'),
      image: require('../res/status_unhealthy_for_sensitive_groups.png'),
      color: '#FE9833',
      fontColor: 'black',
      min: 101,
      max: 360.9,
    },
    {
      key: 3,
      status: I18n.t('status_unhealthy'),
      image: require('../res/status_unhealthy.png'),
      color: '#CC0033',
      fontColor: 'white',
      min: 361,
      max: 649.9,
    },
    {
      key: 4,
      status: I18n.t('status_very_unhealthy'),
      image: require('../res/status_very_unhealthy.png'),
      color: '#660098',
      fontColor: 'white',
      min: 650,
      max: 1249.9,
    },
    {
      key: 5,
      status: I18n.t('status_hazardous'),
      image: require('../res/status_hazardous.png'),
      color: '#7E2200',
      fontColor: 'white',
      min: 1250,
      max: Number.MAX_SAFE_INTEGER,
    },
  ],
};

exports.indexRanges = indexRanges;

const getColor = (index, amount) => {
  let amountColor;
  if (amount && amount.includes && amount.includes('/')) {
    [amountColor] = amount.split('/');
  } else {
    amountColor = amount;
  }

  const isMatched = (
    indexRanges[index] || indexRanges[index.replace('_', '.')]
  ).filter((item) => amountColor >= item.min && amountColor <= item.max);
  if (isMatched && isMatched.length >= 1) {
    return isMatched[0];
  }

  return { color: 'white' };
};

exports.getColor = getColor;
