import { takeEvery, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { GlobalTypes } from '../../constants';

function* apiErrorReceived(action) {
  yield call(toast.error, `Error Received: ${action.error}`);
}

function* watchApiError() {
  yield takeEvery(GlobalTypes.API_ERROR, apiErrorReceived);
}

export default [watchApiError];
