import {takeEvery} from 'redux-saga';
import {select} from 'redux-saga/effects';
import {call, put} from 'redux-saga/effects';
import {postJson, getFromUrl} from '../api/jsonApi';
import logger from '../logger';
import {
    POST_JSON, POST_JSON_SUCCESS, POST_JSON_FAILED,
    INITIALIZE_DATABASE, INITIALIZE_DATABASE_SUCCESS, INITIALIZE_DATABASE_FAILED,
    ASSERT_DATABASE_VALUES, ASSERT_DATABASE_VALUES_SUCCESS, ASSERT_DATABASE_VALUES_FAILED,
    SAVE_SCENARIO, SAVE_SCENARIO_SUCCESS, SAVE_SCENARIO_FAILED,
    RUN_SCENARIO, RUN_SCENARIO_SUCCESS, RUN_SCENARIO_FAILED,
    LOAD_SCENARIOS, LOAD_SCENARIOS_SUCCESS, LOAD_SCENARIOS_FAILED
} from './constants';
import type {State} from './reducer';

function* jsonPost(): void {
  const payload = yield select((state: State): Object => state.request);
  try {
    const response = yield call(postJson('/api/json'), payload);
    yield put({type: POST_JSON_SUCCESS, payload: JSON.parse(response.text)});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: POST_JSON_FAILED, message: e.message});
  }
}

function* initDb(): void {
  const payload = yield select((state: State): Object => state.insert);
  try {
    const response = yield call(postJson('/api/insert'), payload);
    yield put({type: INITIALIZE_DATABASE_SUCCESS, response: response});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: INITIALIZE_DATABASE_FAILED, message: e.message});
  }
}

function* assertDatabaseValues(): void {
  const payload = yield select((state: State): Object => state.select);
  try {
    const response = yield call(postJson('/api/select'), payload);
    yield put({type: ASSERT_DATABASE_VALUES_SUCCESS, response: response});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: ASSERT_DATABASE_VALUES_FAILED, message: e.message});
  }
}

function scenarioPayload(): (state: State) => Object {
  return select((state: State): Object => {
    return {request: state.request, insert: state.insert, select: state.select, name: state.name};
  });
}

function* saveScenario(): void {
  const payload = yield scenarioPayload();
  try {
    const response = yield call(postJson('/api/scenario/save'), payload);
    yield put({type: SAVE_SCENARIO_SUCCESS, response: response});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: SAVE_SCENARIO_FAILED, message: e.message});
  }
}

function* runScenario(): void {
  const payload = yield scenarioPayload();
  try {
    const response = yield call(postJson('/api/scenario/run'), payload);
    yield put({type: RUN_SCENARIO_SUCCESS, response: response});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: RUN_SCENARIO_FAILED, message: e.message});
  }
}

function* loadScenarios(): void {
  try {
    const response = yield call(getFromUrl('/api/scenario/list'));
    yield put({type: LOAD_SCENARIOS_SUCCESS, payload: response.body});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: LOAD_SCENARIOS_FAILED, message: e.message});
  }
}

function* rootSaga(): void {
  yield [
    takeEvery(POST_JSON, jsonPost),
    takeEvery(INITIALIZE_DATABASE, initDb),
    takeEvery(ASSERT_DATABASE_VALUES, assertDatabaseValues),
    takeEvery(SAVE_SCENARIO, saveScenario),
    takeEvery(RUN_SCENARIO, runScenario),
    takeEvery(LOAD_SCENARIOS, loadScenarios)
  ];
}

export default rootSaga;