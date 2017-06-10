import { DOMParser } from 'react-native-html-parser';

const FORECAST = () => {
  const FORECASTURL = 'http://www.aqhi.gov.hk/en.html';

  return fetch(FORECASTURL)
    .then(res => res.text())
    .then((html) => {
      console.log('FORECAST');
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const table = doc.querySelect('#tblForecast')[0];

      const result = {
        general: {},
        roadside: {},
      };
      table.querySelect('tr').forEach((item, i) => {
        item.querySelect('td').forEach((tdItem, j) => {
          if (i === 1 && j === 0) {
            result.date = tdItem.textContent;
          }

          if (i === 2) {
            if (j === 1) {
              result.general.am = tdItem.textContent;
            } else if (j === 2) {
              result.general.pm = tdItem.textContent;
            }
          }

          if (i === 3) {
            if (j === 1) {
              result.roadside.am = tdItem.textContent;
            } else if (j === 2) {
              result.roadside.pm = tdItem.textContent;
            }
          }
        });
      });

      console.log('FORECASTFORECAST', result);
      return result;
    });
};

export default FORECAST;
