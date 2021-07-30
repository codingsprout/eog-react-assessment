import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createClient, Provider, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import uuid from 'react-uuid';

import { GlobalTypes } from '../constants';
import { Measurement, Search, Chart } from './Container';

const useStyles = makeStyles({
  cardRow: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
  query heartBeat {
	heartBeat
  }
  `;

export default () => {
  return (
    <Provider value={client}>
      <Card />
    </Provider>
  );
};

const Card = () => {
  const getMetricSelector = state => {
    const { metric } = state.metric;
    return {
      metric,
    };
  };

  const classes = useStyles();
  const { metric } = useSelector(getMetricSelector);
  const dispatch = useDispatch();
  const [apiPoint, setApiPoint] = useState();

  const [result] = useQuery({
    query,
  });

  const { data, err } = result;

  useEffect(() => {
    if (err) {
      dispatch({ type: GlobalTypes.API_ERROR, error: err.message });
      return;
    }
    if (!data) return;

    setApiPoint(data.apiPoint);
    dispatch({ type: GlobalTypes.API_UPDATE, apiPoint });
  }, [dispatch, data, apiPoint, err]);

  return (
    <>
      <Search />
      <div className={classes.cardRow}>
        {metric ? metric.map(name => <Measurement metricName={name.metricName} key={uuid()} />) : null}
      </div>
      {metric ? <Chart /> : null}
    </>
  );
};
