import axios from 'axios';

const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
});

const earthquakeApi = axios.create({
  baseURL: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0',
});

export const getWeatherData = async (lat: number, lon: number) => {
  const response = await weatherApi.get('/weather', {
    params: {
      lat,
      lon,
      appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};

export const getEarthquakes = async () => {
  const response = await earthquakeApi.get('/summary/all_day.geojson');
  return response.data;
};