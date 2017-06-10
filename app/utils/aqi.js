import { DOMParser } from 'react-native-html-parser';

const AQI = () => {
  const AQIURL = `http://www.weather.org.hk/english/aqi.html?${Math.random()}`;
  return fetch(AQIURL)
    .then(res => res.text())
    .then((html) => {
      console.log('AQI');

      const doc = new DOMParser().parseFromString(html, 'text/html');

      const result = {
        time: doc.querySelect('b') && doc.querySelect('b')[0].textContent.replace('Time: ', ''),
      };
      console.log('AQI updated Time', result.time);

      const table = doc.querySelect('table > table > table')[2];
      table.querySelect('tr').forEach((item, i) => {
        if (i > 1 && i < 18) {
          let distinct;
          const info = {};
          item.querySelect('td').forEach((tdItem, j) => {
            switch (j) {
              case 0:
                distinct = tdItem.textContent;
                break;
              case 1:
                info.NO2 = tdItem.textContent;
                break;
              case 2:
                info.O3 = tdItem.textContent;
                break;
              case 3:
                info.SO2 = tdItem.textContent;
                break;
              case 4:
                info.CO = tdItem.textContent;
                break;
              case 5:
                info.PM10 = tdItem.textContent;
                break;
              case 6:
                info['PM2.5'] = tdItem.textContent;
                break;
              case 7:
                info.AQHI = tdItem.textContent;
                break;
              case 8:
                info.AQI = tdItem.textContent;
                break;
              default:
                break;
            }
          });

          result[distinct] = info;
        }
      });

      console.log(result);
      return result;
    });
};

export default AQI;
