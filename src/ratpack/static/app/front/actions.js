import {INITIALIZE_DATABASE, POST_JSON, ASSERT_DATABASE_VALUES, UPDATE_EXPECTED_DATABASE, UPDATE_DATABASE_ASSETION_QUERY} from './constants';

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
export function updateSelect(query: string): Action {
  return {type: UPDATE_DATABASE_ASSETION_QUERY, payload: query};
}
export function updateExpected(expectedCsv: string): Action {
  return {type: UPDATE_EXPECTED_DATABASE, payload: expectedCsv};
}
