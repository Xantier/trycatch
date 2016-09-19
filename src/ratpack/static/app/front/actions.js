import {
    INITIALIZE_DATABASE,
    POST_JSON,
    ASSERT_DATABASE_VALUES,
    UPDATE_EXPECTED_DATABASE,
    UPDATE_DATABASE_ASSERTION_QUERY,
    SAVE_SCENARIO,
    UPDATE_JSON, UPDATE_JSON_FAILED,
    UPDATE_DATABASE_INITALIZATION_QUERY
} from './constants';

type Action = {
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any,
}
export function initializeDatabase(query: String): Action {
  return {
    type: INITIALIZE_DATABASE,
    payload: {
      query: query
    }
  };
}
export function assertDatabaseValues(query: String): Action {
  return {
    type: ASSERT_DATABASE_VALUES,
    payload: {
      query: query
    }
  };
}
export function postJson(json: string): Action {
  return {type: POST_JSON, payload: json};
}

export function updateJson(jsonStr: string): Action {
  try {
    const jsonObj = JSON.parse(jsonStr);
    return {type: UPDATE_JSON, payload: jsonObj};
  } catch (_) {
    return {type: UPDATE_JSON_FAILED};
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

export function saveScenario(): Action {
  return {type: SAVE_SCENARIO};
}
