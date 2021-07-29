import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createClient, Provider, useQuery } from 'urql';
import uuid from 'react-uuid';
import moment from 'moment';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Label } from 'recharts';
import { GlobalTypes } from '../../constants';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});
const query = `
  query($input: [MeasurementQuery]) {
	getMultipleMeasurements(input: $input) {
	  metric
	  measurements {
		metric
		at
		value
		unit
	  }
	}
  }
  `;

export default () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};

const Chart = () => {
  const getSelectorMetric = metricState => {
    const { metric } = metricState.metric;
    return {
      metric,
    };
  };

  const getSelectorHeartBeat = heartBeatState => {
    const { heartBeat } = heartBeatState.heartBeat;
    return {
      heartBeat,
    };
  };

  const { metric } = useSelector(getSelectorMetric);
  const { heartBeat } = useSelector(getSelectorHeartBeat);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [combine, setCombine] = useState([]);

  const updateMetrics = metric
    ? metric.map(name => {
        name.after = heartBeat - 1800000;
        return name;
      })
    : null;

  const momentDate = value => {
    return moment.unix(value).toDate();
  };
  const [res, executeQuery] = useQuery({
    query,
    skip: !updateMetrics,
    variables: {
      input: updateMetrics ? updateMetrics : metric,
    },
  });

  const { response, err } = res;

  useEffect(() => {
    setData([]);

    if (err) {
      dispatch({ type: GlobalTypes.API_ERROR, error: err.message });
      return;
    }

    if (!response) return;

    response.getMultipleMeasurements.map(item => {
      return data.push(item.measurements);
    });

    let combine = Array.prototype.concat.apply([], data);
    combine.map(item => {
      item[item.metric] = item.value;
    });

    setCombine(combine);
  }, [data, dispatch, err, executeQuery]);

  return (
    <ResponsiveContainer width="100%" maxHeight={800}>
      <LineChart height={500} data={combine} margin={{ top: 4, right: 20, left: 20, bottom: 4 }}>
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis dataKey="at" type={'date'} tickFormatter={momentDate} />
        <YAxis yAxisId="PSI" orientation="left">
          <Label value="PSI" offset={20} position="bottom" style={{ textAnchor: 'middle' }} />
        </YAxis>
        <YAxis yAxisId="%" orientation="left">
          <Label value="%" offset={20} position="bottom" style={{ textAnchor: 'middle' }} />
        </YAxis>
        <YAxis yAxisId="F">
          <Label value="F" offset={20} position="bottom" style={{ textAnchor: 'middle' }} />
        </YAxis>

        <Legend />
        {metric
          ? metric.map(metricName => {
              let yAxisID;

              if (metricName.metricName === 'casingPressure' || 'tubingPressure') {
                yAxisID = 'PSI';
                return (
                  <Line
                    key={uuid()}
                    yAxisId={yAxisID}
                    type="linear"
                    xAxisId="at"
                    name={metricName.metricName}
                    dataKey={metricName.metricName}
                    stroke={'#' + (((1 << 24) * Math.random()) | 0).toString(16)}
                    activeDot={{ r: 5 }}
                    dot={false}
                  />
                );
              } else if (metricName.metricName === 'oilTemp' || 'flareTemp' || 'waterTemp') {
                yAxisID = 'F';
                return (
                  <Line
                    key={uuid()}
                    yAxisId={yAxisID}
                    type="linear"
                    xAxisId="at"
                    name={metricName.metricName}
                    datakey={metricName.metricName}
                    stroke={'#' + (((1 << 24) * Math.random()) | 0).toString(16)}
                    activeDot={{ r: 5 }}
                    dot={false}
                  />
                );
              } else if (metricName.metricName === 'injValveOpen') {
                yAxisID = '%';
                return (
                  <Line
                    key={uuid()}
                    yAxisId={yAxisID}
                    type="linear"
                    xAxisID="at"
                    name={metricName.metricName}
                    dataKey={metricName.metricName}
                    stroke={'#' + (((1 << 24) * Math.random()) | 0).toString(16)}
                    activeDot={{ r: 5 }}
                    dot={false}
                  />
                );
              }
            })
          : null}
      </LineChart>
    </ResponsiveContainer>
  );
};
