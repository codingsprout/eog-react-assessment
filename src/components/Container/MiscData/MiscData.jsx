import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './style';
import { GlobalTypes } from '../../../constants';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
		query ($metricName: String!) {
		  getLastKnownMeasurement(metricName: $metricName) {
		    metric
		    value
		    unit
		    at
		  }
		}
		`;

export default props => {
  return (
    <Provider value={client}>
      <MiscData {...props} />
    </Provider>
  );
};

const MiscData = props => {
  const [measure, setMeasure] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();

  const [result, executeQuery] = useQuery({
    query,
    variables: {
      metricName: props.metricName,
    },
  });

  const { data, err } = result;

  useEffect(() => {
    if (err) {
      dispatch({ type: GlobalTypes.API_ERROR, error: err.message });
      return;
    }
    if (!data) return;

    setMeasure(data.getLastKnownMeasurement);

    const interval = setInterval(() => {
      executeQuery({ requestPolicy: 'network-only' });
      setMeasure(data.getLastKnownMeasurement);
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch, data, err, executeQuery]);

  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h5">{props.metricName}</Typography>
        <Typography component="p">
          {props.metricName ? `Previously used information: ${measure.value} ${measure.unit}` : null}
        </Typography>
      </Paper>
    </div>
  );
};
