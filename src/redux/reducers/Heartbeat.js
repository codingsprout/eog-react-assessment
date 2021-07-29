import { GlobalTypes } from '../../constants';

const initialState = {
  beat: null,
};

const heartBeat = (state, action) => {
  return { beat: action.beat };
};

const heartBeatHandler = {
  [GlobalTypes.REQUEST_HEARTBEAT]: heartBeat,
};

const heartBeatReducer = (state = initialState, action) => {
  const handler = heartBeatHandler[action.type];

  if (typeof handler === 'undefined') return state;

  return handler(state, action);
};

export default heartBeatReducer;
