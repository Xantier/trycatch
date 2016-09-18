import {handleActions} from 'redux-actions';
import {
    INITIALIZE_DATABASE_SUCCESS,
    INITIALIZE_DATABASE_FAILED,
    POST_JSON_SUCCESS,
    POST_JSON_FAILED,
    UPDATE_DATABASE_ASSERTION_QUERY,
    UPDATE_EXPECTED_DATABASE,
    UPDATE_JSON,
    UPDATE_DATABASE_INITALIZATION_QUERY
} from './constants';

export type State = {
  query: string,
  expected: string
};

const reducer = handleActions({
  [UPDATE_DATABASE_ASSERTION_QUERY]: (state: State, action: Object): State => {
    return {...state, select: action.payload};
  },
  [UPDATE_EXPECTED_DATABASE]: (state: State, action: Object): State => {
    return {...state, expectation: action.payload};
  },
  [UPDATE_JSON]: (state: State, action: Object): State => {
    return {...state, request: action.payload};
  },
  [UPDATE_DATABASE_INITALIZATION_QUERY]: (state: State, action: Object): State => {
    return {...state, insert: action.payload};
  },
  [POST_JSON_SUCCESS]: (state: State, action: Object): State => {
    return {...state, jsonPostResponse: action.payload};
  },
  [POST_JSON_FAILED]: (state: State, action: Object): State => {
    return {...state, jsonPostResponse: action.payload};
  },
  [INITIALIZE_DATABASE_SUCCESS]: (state: State, action: Object): State => {
    return {...state, databaseInsertResponse: action.payload};
  },
  [INITIALIZE_DATABASE_FAILED]: (state: State, action: Object): State => {
    return {...state, databaseInsertResponse: action.payload};
  }
}, {});

export default reducer;