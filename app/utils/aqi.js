const AQI = () => {
  const AQIURL = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.weather.org.hk%2Fenglish%2Faqi.html%3Fr%3D${Math.random()}%22%20and%20xpath%3D%22%2F%2Ftable%2F%2Ftable%2F%2Ftable%22&format=json&diagnostics=true&callback=`;

  return fetch(AQIURL)
    .then(res => res.json())
    .then((json) => {
      // console.log(json.query.results)
      console.log(json.query.results.table[0].tbody.tr.td.center.b.replace('Time: ', ''));
      const result = {
        time: json.query.results.table[0].tbody.tr.td.center.b.replace('Time: ', ''),
      };
      console.log('city', 'NO2', 'O3', 'SO2', 'CO', 'PM10', 'PM2.5', 'AQHI', 'AQI');
      json.query.results.table[1].tbody.tr.slice(2).forEach((element) => {
        console.log(
          element.td[0],
          element.td[1].font.content,
          element.td[2].font.content,
          element.td[3].font.content,
          element.td[4].font.content,
          element.td[5].font.content,
          element.td[6].font.content,
          element.td[7].font.content,
          element.td[8].font.content,
        );
        result[element.td[0]] = {
          NO2: element.td[1].font.content,
          O3: element.td[2].font.content,
          SO2: element.td[3].font.content,
          CO: element.td[4].font.content,
          PM10: element.td[5].font.content,
          'PM2.5': element.td[6].font.content,
          AQHI: element.td[7].font.content,
          AQI: element.td[8].font.content,
        };
      });
      return result;
    });
};

export default AQI;
