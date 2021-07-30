import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import { createClient, Provider, useQuery } from 'urql';

import { useStyles, MenuProp } from './style';
import { GlobalTypes } from '../../../constants';

import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
  query getMetrics {
	getMetrics
  }
  `;

const getStyles = (name, metricNames, theme) => {
  return {
    fontWeight:
      metricNames.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Search />
    </Provider>
  );
};

const Search = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [metricName, setMetricName] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const dispatch = useDispatch();

  const onChangeHandler = e => {
    setMetricName(e.target.value);
  };

  const [result] = useQuery({
    query,
  });

  const { data, err } = result;

  useEffect(() => {
    dispatch({ type: actions.DATA_NAME_ADDED, metricNames });
    if (err) {
      dispatch({ type: GlobalTypes.API_ERROR, error: err.message });
      return;
    }
    if (!data) return;
    setMetrics(data.getMetrics);
  }, [dispatch, data, err, metricNames]);

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="metric-select">Metric</InputLabel>
        <Select
          multiple
          value={metricName}
          onChange={onChangeHandler}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chip}>
              {selected.map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProp}
        >
          {metrics.map(name => (
            <MenuItem key={name} value={name} style={getStyles(name, metrics, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
