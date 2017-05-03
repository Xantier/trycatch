import {takeEvery} from 'redux-saga';
import {select} from 'redux-saga/effects';
import {call, put} from 'redux-saga/effects';
import logger from 'loglevel';

import {postJson, getFromUrl} from '../api/jsonApi';
import {normalizeScenarios} from './normalizer';
import * as t from './constants';
import type {State} from './reducer';
import type {Action} from './actions';

function* jsonPost(): void {
  const payload = yield select((state: State): Object => state.active.request);
  try {
    const response = yield call(postJson('/api/json'), payload);
    yield put({type: t.POST_JSON_SUCCESS, payload: JSON.parse(response.text)});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.POST_JSON_FAILED, payload: JSON.parse(e.response.text)});
  }
}

function* initDb(): void {
  const payload = yield select((state: State): Object => state.active.insert);
  try {
    const response = yield call(postJson('/api/insert'), payload);
    yield put({type: t.INITIALIZE_DATABASE_SUCCESS, response: JSON.parse(response.text)});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.INITIALIZE_DATABASE_FAILED, payload: JSON.parse(e.response.text)});
  }
}

function* assertDatabaseValues(): void {
  const payload = yield select((state: State): Object => state.active.select);
  try {
    const response = yield call(postJson('/api/select'), {json: payload});
    yield put({type: t.ASSERT_DATABASE_VALUES_SUCCESS, response: JSON.parse(response.text)});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.ASSERT_DATABASE_VALUES_FAILED, payload: JSON.parse(e.response.text)});
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
    const response = yield call(postJson('/api/scenario/save'), payload);
    yield put({type: t.SAVE_SCENARIO_SUCCESS, response: JSON.parse(response.text)});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.SAVE_SCENARIO_FAILED, payload: JSON.parse(e.response.text)});
  }

}

function* runScenario(): void {
  const payload = yield scenarioPayload();
  try {
    const response = yield call(postJson('/api/scenario/run'), payload);
    yield put({type: t.RUN_SCENARIO_SUCCESS, response: JSON.parse(response.text)});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    logger.error(e.response.text);
    yield put({type: t.RUN_SCENARIO_FAILED, payload: JSON.parse(e.response.text)});
  }
}

function* loadScenarios(): void {
  try {
    const response = yield call(getFromUrl('/api/scenario/list'));
    const scenarios = normalizeScenarios(JSON.parse(response.text));
    yield put({type: t.LOAD_SCENARIOS_SUCCESS, response: scenarios});
  } catch (e) {
    logger.error('Failed to post JSON. Error: ' + e);
    yield put({type: t.LOAD_SCENARIOS_FAILED, payload: JSON.parse(e.response.text)});
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