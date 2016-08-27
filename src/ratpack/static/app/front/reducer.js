import {handleActions} from 'redux-actions';
import {
    INITIALIZE_DATABASE_SUCCESS,
    INITIALIZE_DATABASE_FAILED,
    POST_JSON_SUCCESS,
    POST_JSON_FAILED,
    UPDATE_DATABASE_ASSETION_QUERY,
    UPDATE_EXPECTED_DATABASE
} from './constants';

export type State = {
  query: string,
  expected: string
};

const reducer = handleActions({
  [UPDATE_DATABASE_ASSETION_QUERY]: (state: State, action: Object): State => {
    return {...state, query: action.payload};
  },
  [UPDATE_EXPECTED_DATABASE]: (state: State, action: Object): State => {
    return {...state, expected: action.payload};
  },
  [POST_JSON_SUCCESS]: (state: State, action: Object) => state.set(action.payload),
  [POST_JSON_FAILED]: (state: State, action: Object) => state.set(action.payload),
  [INITIALIZE_DATABASE_SUCCESS]: (state: State, action: Object) => state.set(action.payload),
  [INITIALIZE_DATABASE_FAILED]: (state: State, action: Object) => state.set(action.payload)
}, {});

export default reducer;