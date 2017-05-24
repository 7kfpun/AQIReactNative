const FORECAST = () => {
  const FORECASTURL = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.aqhi.gov.hk%2Fen.html%22%20and%20xpath%3D%22%2F%2Ftable%5B%40id%3D%5C%27tblForecast%5C%27%5D%2F%2Ftr%22&format=json&diagnostics=true&callback=';

  return fetch(FORECASTURL)
    .then(res => res.json())
    .then((json) => {
      const result = {
        date: json.query.results.tr[1].td[0].content,
        general: {
          am: json.query.results.tr[2].td[1],
          pm: json.query.results.tr[2].td[2],
        },
        roadside: {
          am: json.query.results.tr[3].td[1],
          pm: json.query.results.tr[3].td[2],
        },
      };
      console.log(result);
      return result;
    });
};

export default FORECAST;
