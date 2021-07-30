import { GlobalTypes } from '../../constants';

const initialState = {
  metricNames: [],
};

const metricDataName = (state, action) => {
  const { getMetricNames } = action;
  const { metricNames } = getMetricNames;

  return {
    metricNames,
  };
};

const metricDataAdd = (state, action) => {
  if (action.metricNames.length > 0) {
    let metricNames = [];
    action.metricNames.forEach(data => {
      metricNames.push({
        metricNames: data,
      });
    });
    return { metricNames }; //make sure its obj
  }
  return { state };
}; // determine when metric name is added for action

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
