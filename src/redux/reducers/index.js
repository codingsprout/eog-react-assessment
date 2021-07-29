import { combineReducers } from 'redux';
import heartBeatReducer from './Heartbeat';
import metricDataReducer from './Metric';
import weatherReducer from './Weather';

const rootReducer = combineReducers({
  heartBeat: heartBeatReducer,
  metric: metricDataReducer,
  weather: weatherReducer,
});

export default rootReducer;
