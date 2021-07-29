import { GlobalTypes } from '../../constants';

const initialState = {
  temperatureinCelsius: null,
  temperatureinFahrenheit: null,
  description: '',
  locationName: '',
};

const toF = c => (c * 9) / 5 + 32;

const weatherData = (state, action) => {
  const { getWeatherForLocation } = action;
  const { description, locationName, temperatureinCelsius } = getWeatherForLocation;

  return {
    temperatureinCelsius,
    temperatureinFahrenheit: toF(temperatureinCelsius),
    description,
    locationName,
  };
};

const weatherDatahandlers = {
  [GlobalTypes.WEATHER_DATA]: weatherData,
};

const weatherReducer = (state = initialState, action) => {
  const handler = weatherDatahandlers[action.type];
  if (typeof handler === 'undefined') return state;
  return handler(state, action);
};

export default weatherReducer;
