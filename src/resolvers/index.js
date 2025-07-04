import Resolver from '@forge/resolver';
import api, { fetch, route } from '@forge/api'

const resolver = new Resolver();

export const storeWeather = async (weather, issueId) => {
    console.log('Stores weather data in issue config...')
    console.log(weather)
    // todo check data is ok 

    var bodyData = `{
      "coord" : {
        "lon" : ${weather.coord.lon},
        "lat" : ${weather.coord.lat}  
      },
      "main" : {
        "temp" : ${weather.main.temp},
        "feels_like" : ${weather.main.feels_like},
        "temp_min" : ${weather.main.temp_min},
        "temp_max" : ${weather.main.temp_max},
        "pressure" : ${weather.main.pressure},
        "humidity" : ${weather.main.humidity}
      },
      "visibility" : ${weather.visibility},
      "wind" : {
        "speed" : ${weather.wind.speed},
        "deg" : ${weather.wind.deg}
      },
      "clouds" : {
        "all" : ${weather.clouds.all}
      },
      "dt" : ${weather.dt},
      "sys" : {
        "country" : "${weather.sys.country}",
        "sunrise" : ${weather.sys.sunrise},
        "sunset" : ${weather.sys.sunset}
      },
      "timezone" : ${weather.timezone},
      "id" : ${weather.id},
      "name" : "${weather.name}",
      "cod" : ${weather.cod}
    }`;

    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueId}/properties/dev-day-app-weather`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyData
    })
    console.log(response);
    return response;
    // todo check for errors
  }

export const fetchProjectConfig = async (projectId) => {
  const response = await api.asApp().requestJira(route`/rest/api/3/project/${projectId}/properties/dev-day-app-project-settings-page`)
  const storedProjectData = await response.json();
  console.log(storedProjectData)
  return(storedProjectData.value)
}

export const fetchWeather = async (config) => {
  const lon = config.lon;
  const lat = config.lat;
  const unit = config.tempUnit;

  const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=" + unit + "&appid=" + process.env.WEATHER_KEY;
  
  const response = await fetch(url)
  
  if(!response.ok) {
      const errmsg = `Error from Open Weather Map Weather API: ${response.status} ${await response.text()}`;
      console.error(errmsg)
      throw new Error(errmsg)
  }

  const weather = await response.json()

  console.log('fetchWeather response')
  console.log(response);
  console.log('fetchWeather json')
  console.log(weather);

  return weather;
}

resolver.define('getText', (req) => {
  console.log(req);
  return 'Hello, world!';
});

resolver.define('getWeather', async (req) => {

  console.log(req.payload.config);
  if(req.payload.config != null){
    return (await fetchWeather(req.payload.config));
  } else {
    return null;
  }

})

export const handler = resolver.getDefinitions();
