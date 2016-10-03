import {
    INITIALIZE_DATABASE,
    POST_JSON,
    ASSERT_DATABASE_VALUES,
    UPDATE_EXPECTED_DATABASE,
    UPDATE_DATABASE_ASSERTION_QUERY,
    SAVE_SCENARIO,
    RUN_SCENARIO,
    UPDATE_JSON, UPDATE_JSON_FAILED, UPDATE_NAME,
    UPDATE_DATABASE_INITALIZATION_QUERY,
    UPDATE_REQUEST
} from './constants';

type Action = {
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any,
}
export function updateRequest(contentType: string, text: string, id?: number): Action {
  return {type: UPDATE_REQUEST, payload: text, meta: {contentType, id}};
}

export function updateName(scenarioName: string): Action {
  return {type: UPDATE_NAME, payload: scenarioName};
}

export function updateJson(jsonStr: string, contentType: string): Action {
  try {
    const jsonObj = JSON.parse(jsonStr);
    return {type: UPDATE_JSON, payload: jsonObj, meta: contentType};
  } catch (_) {
    return {type: UPDATE_JSON_FAILED, meta: contentType};
  }
}
export function updateInitializationScript(json: string): Action {
  return {type: UPDATE_DATABASE_INITALIZATION_QUERY, payload: json};
}
export function updateSelect(query: string): Action {
  return {type: UPDATE_DATABASE_ASSERTION_QUERY, payload: query};
}
export function updateExpected(expectedCsv: string): Action {
  return {type: UPDATE_EXPECTED_DATABASE, payload: expectedCsv};
}

export function initializeDatabase(): Action {
  return {type: INITIALIZE_DATABASE};
}
export function assertDatabaseValues(): Action {
  return {type: ASSERT_DATABASE_VALUES};
}
export function postJson(): Action {
  return {type: POST_JSON};
}
export function saveScenario(): Action {
  return {type: SAVE_SCENARIO};
}
export function runScenario(): Action {
  return {type: RUN_SCENARIO};
}