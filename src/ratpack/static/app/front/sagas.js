import {takeEvery} from 'redux-saga';
import {select} from 'redux-saga/effects';
import {call, put} from 'redux-saga/effects';
import {postJson} from '../api/jsonApi';
import logger from '../logger';
import {
    POST_JSON, POST_JSON_SUCCESS, POST_JSON_FAILED,
    INITIALIZE_DATABASE, INITIALIZE_DATABASE_SUCCESS, INITIALIZE_DATABASE_FAILED,
    ASSERT_DATABASE_VALUES, ASSERT_DATABASE_VALUES_SUCCESS, ASSERT_DATABASE_VALUES_FAILED
} from './constants';
import type {State} from './reducer';

function* post(action: Object): void {
  try {
    const response = yield call(postJson('/api/json'), action.payload);
    yield put({type: POST_JSON_SUCCESS, response: response});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: POST_JSON_FAILED, message: e.message});
  }
}

function* initDb(action: Object): void {
  try {
    const response = yield call(postJson('/api/insert'), action.payload);
    yield put({type: INITIALIZE_DATABASE_SUCCESS, response: response});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: INITIALIZE_DATABASE_FAILED, message: e.message});
  }
}

function* assertDatabaseValues(): void {
  const payload = yield select((state: State): Object => {
    return {
      query: state.query,
      expected: state.expected
    };
  });
  console.log(payload);
  try {
    const response = yield call(postJson('/api/select'), payload);
    yield put({type: ASSERT_DATABASE_VALUES_SUCCESS, response: response});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: ASSERT_DATABASE_VALUES_FAILED, message: e.message});
  }
}

function* rootSaga(): void {
  yield [
    takeEvery(POST_JSON, post),
    takeEvery(INITIALIZE_DATABASE, initDb),
    takeEvery(ASSERT_DATABASE_VALUES, assertDatabaseValues)
  ];
}

export default rootSaga;