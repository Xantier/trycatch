import {takeEvery} from 'redux-saga';
import {select} from 'redux-saga/effects';
import {call, put} from 'redux-saga/effects';
import logger from 'loglevel';

import {postJson, getFromUrl} from '../api/jsonApi';
import {normalizeScenarios, normalizeRunPayload} from './normalizer';
import * as t from './constants';
import notification from '../front/notification';
import type {State} from './reducer';

const extractErrorResponse = (e: Object): Object => {
  let response = '';
  try {
    response = JSON.parse(e.response.text);
  } catch (e2) {
    logger.error('Failed to parse JSON response.');
  }
  notification(response.message ? `Server responded with an error: ${response.message}` : 'Server responded with an error', true);
  return response;
};

function* jsonPost(): void {
  const payload = yield select((state: State): Object => state.active.request);
  try {
    notification('Posting');
    const response = yield call(postJson('/api/json'), payload);
    notification('Got Response', false);
    yield put({type: t.POST_JSON_SUCCESS, payload: JSON.parse(response.text)});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.POST_JSON_FAILED, payload: extractErrorResponse(e)});
  }
}

function* initDb(): void {
  const payload = yield select((state: State): Object => state.active.insert);
  try {
    notification('Initializing Database state');
    const response = yield call(postJson('/api/insert'), payload);
    notification('Database initialization call succeeded', false);
    yield put({type: t.INITIALIZE_DATABASE_SUCCESS, payload: JSON.parse(response.text)});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.INITIALIZE_DATABASE_FAILED, payload: extractErrorResponse(e)});
  }
}

function* assertDatabaseValues(): void {
  const payload = yield select((state: State): Object => state.active.select);
  try {
    notification('Asserting Database data');
    const response = yield call(postJson('/api/select'), {json: payload});
    notification('Database assertion call succeeded', false);
    yield put({type: t.ASSERT_DATABASE_VALUES_SUCCESS, payload: JSON.parse(response.text)});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.ASSERT_DATABASE_VALUES_FAILED, payload: extractErrorResponse(e)});
  }
}

function scenarioPayload(): (state: State) => Object {
  return select((state: State): Object => {
    return {
      request: state.active.request,
      insert: state.active.insert,
      select: state.active.select,
      name: state.active.name
    };
  });
}

function* saveScenario(): void {
  const payload = yield scenarioPayload();
  try {
    notification('Saving Scenario');
    const response = yield call(postJson('/api/scenario/save'), payload);
    notification('Scenario saved successfully', false);
    yield put({type: t.SAVE_SCENARIO_SUCCESS, response: JSON.parse(response.text)});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.SAVE_SCENARIO_FAILED, payload: extractErrorResponse(e)});
  }

}

function* runScenario(): void {
  const payload = yield scenarioPayload();
  try {
    notification('Running Scenario');
    const response = yield call(postJson('/api/scenario/run'), payload);
    notification('Scenario run completed', false);
    yield put({type: t.RUN_SCENARIO_SUCCESS, payload: normalizeRunPayload(JSON.parse(response.text)), scenario: payload});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.RUN_SCENARIO_FAILED, payload: normalizeRunPayload(extractErrorResponse(e)), scenario: payload});
  }
}

function* loadScenarios(): void {
  try {
    const response = yield call(getFromUrl('/api/scenario/list'));
    const scenarios = normalizeScenarios(JSON.parse(response.text));
    yield put({type: t.LOAD_SCENARIOS_SUCCESS, response: scenarios});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.LOAD_SCENARIOS_FAILED, payload: extractErrorResponse(e)});
  }
}
function* selectAndRunScenario(action: Action): void {
  yield put({type: t.SELECT_SCENARIO, payload: action.payload});
  yield runScenario();
}

function* rootSaga(): void {
  yield [
    takeEvery(t.POST_JSON, jsonPost),
    takeEvery(t.INITIALIZE_DATABASE, initDb),
    takeEvery(t.ASSERT_DATABASE_VALUES, assertDatabaseValues),
    takeEvery(t.SAVE_SCENARIO, saveScenario),
    takeEvery(t.RUN_SCENARIO, runScenario),
    takeEvery(t.SELECT_AND_RUN_SCENARIO, selectAndRunScenario),
    takeEvery(t.LOAD_SCENARIOS, loadScenarios)
  ];
}

export default rootSaga;