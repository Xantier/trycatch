import {handleActions} from 'redux-actions';
import {
    INITIALIZE_DATABASE_SUCCESS,
    INITIALIZE_DATABASE_FAILED,
    POST_JSON_SUCCESS,
    POST_JSON_FAILED,
    UPDATE_DATABASE_ASSERTION_QUERY,
    UPDATE_EXPECTED_DATABASE
} from './constants';

export type State = {
  query: string,
  expected: string
};

const reducer = handleActions({
  [UPDATE_DATABASE_ASSERTION_QUERY]: (state: State, action: Object): State => {
    return {...state, query: action.payload};
  },
  [UPDATE_EXPECTED_DATABASE]: (state: State, action: Object): State => {
    return {...state, expected: action.payload};
  },
  [POST_JSON_SUCCESS]: (state: State, action: Object): State => {
    return {...state, jsonpostResponse: action.payload};
  },
  [POST_JSON_FAILED]: (state: State, action: Object): State => {
    return {...state, jsonpostResponse: action.payload};
  },
  [INITIALIZE_DATABASE_SUCCESS]: (state: State, action: Object): State => {
    return {...state, databaseInsertResponse: action.payload};
  },
  [INITIALIZE_DATABASE_FAILED]: (state: State, action: Object): State => {
    return {...state, databaseInsertResponse: action.payload};
  }
}, {});

export default reducer;