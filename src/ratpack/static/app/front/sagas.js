import {takeEvery} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
import {postJson} from '../api/jsonApi';
import logger from '../logger';

function* post(action: Object): void {
  try {
    const response = yield call(postJson('/api/json'), action.payload);
    yield put({type: 'POST_JSON_SUCCESS', response: response});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: 'POST_JSON_FAILED', message: e.message});
  }
}

function* initDb(action: Object): void {
  try {
    const response = yield call(postJson('/api/insert'), action.payload);
    yield put({type: 'INITIALIZE_DATABASE_SUCCESS', response: response});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: 'INITIALIZE_DATABASE_FAILED', message: e.message});
  }
}

function* rootSaga(): void {
  yield [
    takeEvery('POST_JSON', post),
    takeEvery('INITIALIZE_DATABASE', initDb)
  ];
}

export default rootSaga;