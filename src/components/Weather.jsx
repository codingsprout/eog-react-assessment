import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import { useGeolocation } from 'react-use';
import LinearProgress from '@material-ui/core/LinearProgress';

import Chip from './Chip';
import { GlobalTypes } from '../constants';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query($latLong: WeatherQuery!) {
  getWeatherForLocation(latLong: $latLong) {
    description
    locationName
    temperatureinCelsius
  }
}
`;

const getWeather = state => {
  const { temperatureinFahrenheit, description, locationName } = state.weather;
  return {
    temperatureinFahrenheit,
    description,
    locationName,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Weather />
    </Provider>
  );
};

const Weather = () => {
  const getLocation = useGeolocation(); // Default to houston
  const dispatch = useDispatch();

  const latLong = {
    latitude: getLocation.latitude || 29.7604,
    longitude: getLocation.longitude || -95.3698,
  }; // static data here

  const { temperatureinFahrenheit, description, locationName } = useSelector(getWeather);

  const [result] = useQuery({
    query,
    variables: {
      latLong,
    },
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch({ type: GlobalTypes.API_ERROR, error: error.message });
      return;
    }
    if (!data) return;
    const { getWeatherForLocation } = data;
    dispatch({ type: GlobalTypes.WEATHER_DATA, getWeatherForLocation });
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return <Chip label={`Weather in ${locationName}: ${description} and ${temperatureinFahrenheit}°`} />;
};
