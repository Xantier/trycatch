import {takeEvery} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
import {postJson} from '../api/jsonApi';
import logger from '../logger';

function* post(action) {
  try {
    const response = yield call(postJson, action.payload);
    yield put({type: 'POST_JSON_SUCCESS', response: response});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: 'POST_JSON_FAILED', message: e.message});
  }
}

function* postJsonSaga() {
  yield* takeEvery('POST_JSON', post);
}

export default postJsonSaga;