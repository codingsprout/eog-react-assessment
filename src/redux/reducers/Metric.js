import { GlobalTypes } from '../../constants';

const initialState = {
  namesOfMetric: [], //initialize with empty array to store different metrics
};

const metricDataAdd = (state, action) => {
  if (action.namesOfMetric.length > 0) {
    let namesOfMetric = []; //don't forget this or cause error
    action.namesOfMetric.forEach(data => {
      namesOfMetric.push({
        namesOfMetric: data,
      });
    });
    return { namesOfMetric }; //make sure its obj
  }
  return { state };
}; // determine when metric name is added for action

const metricDataName = (state, action) => {
  const { getMetricName } = action;
  const { namesOfMetric } = getMetricName;

  return {
    namesOfMetric,
  };
}; //fired action whenever get name of metric

const metricDataHandler = {
  [GlobalTypes.METRIC_ADD]: metricDataAdd,
  [GlobalTypes.METRIC_GET]: metricDataName,
};

const metricDataReducer = (state = initialState, action) => {
  const handler = metricDataHandler[action.type];

  if (typeof handler === 'undefined') return state;
  return handler(state, action);
};

export default metricDataReducer;
