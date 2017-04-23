import * as t from './constants';

type Action = {
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any,
}
export function updateRequest(contentType: string, text: string, id?: number): Action {
  return {type: t.UPDATE_REQUEST, payload: text, meta: {contentType, id}};
}

export function updateName(scenarioName: string): Action {
  return {type: t.UPDATE_NAME, payload: scenarioName};
}

export function updateJson(jsonStr: string, contentType: string): Action {
  try {
    const jsonObj = JSON.parse(jsonStr);
    return {type: t.UPDATE_JSON, payload: jsonObj, meta: contentType, rawPayload: jsonStr};
  } catch (_) {
    return {type: t.UPDATE_JSON_FAILED, meta: contentType, rawPayload: jsonStr};
  }
}
export function updateInitializationScript(json: string): Action {
  return {type: t.UPDATE_DATABASE_INITALIZATION_QUERY, payload: json};
}
export function updateSelect(query: string): Action {
  return {type: t.UPDATE_DATABASE_ASSERTION_QUERY, payload: query};
}
export function updateExpected(expectedCsv: string): Action {
  return {type: t.UPDATE_EXPECTED_DATABASE, payload: expectedCsv};
}

export function initializeDatabase(): Action {
  return {type: t.INITIALIZE_DATABASE};
}
export function assertDatabaseValues(): Action {
  return {type: t.ASSERT_DATABASE_VALUES};
}
export function postJson(): Action {
  return {type: t.POST_JSON};
}
export function newScenario(): Action {
  return {type: t.NEW_SCENARIO};
}
export function saveScenario(): Action {
  return {type: t.SAVE_SCENARIO};
}
export function runScenario(): Action {
  return {type: t.RUN_SCENARIO};
}
export function loadScenarios(): Action {
  return {type: t.LOAD_SCENARIOS};
}
export function selectScenario(name: string): Action {
  return {type: t.SELECT_SCENARIO, payload: name};
}
export function selectAndRunScenario(name: string): Action {
  return {type: t.SELECT_AND_RUN_SCENARIO, payload: name};
}