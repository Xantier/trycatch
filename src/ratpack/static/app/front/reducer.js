import {handleActions} from 'redux-actions';
import {
    INITIALIZE_DATABASE_SUCCESS,
    INITIALIZE_DATABASE_FAILED,
    POST_JSON_SUCCESS,
    POST_JSON_FAILED,
    UPDATE_DATABASE_ASSERTION_QUERY,
    UPDATE_EXPECTED_DATABASE,
    UPDATE_JSON, UPDATE_JSON_FAILED,
    UPDATE_DATABASE_INITALIZATION_QUERY,
    UPDATE_NAME,
    UPDATE_REQUEST
} from './constants';

export type Request = {
  payload: string,
  expected: string,
  validJson: Object[],
  url: string,
  method: string,
  params: Object[]
}

export type State = {
  select: string,
  expectation: string,
  request: Request,
  requestResponse: Object,
  insert: string
};

const init = {
  request: {
    validJson: {
      payload: true,
      expected: true
    },
    url: '',
    method: '',
    params: []
  }
};

function updateHeader(state: Object[], action: Object): Object {
  if (action.meta.contentType.endsWith('add')) {
    return [...state, {key: '', value: '', id: state.length + 1}];
  }
  return state.map((it: Object): Object => {
    if (it.id === action.meta.id) {
      return action.meta.contentType.endsWith('key') ? {...it, key: action.payload} : {...it, value: action.payload};
    }
    return it;
  });
}
const reducer = handleActions({
  [UPDATE_NAME]: (state: State, action: Object): State => {
    return {...state, name: action.payload};
  },
  [UPDATE_REQUEST]: (state: State, action: Object): State => {
    if (action.meta.contentType.startsWith('header')) {
      return {...state, request: {...state.request, params: updateHeader(state.request.params, action)}};
    }
    return {...state, request: {...state.request, [action.meta.contentType]: action.payload}};
  },
  [UPDATE_DATABASE_ASSERTION_QUERY]: (state: State, action: Object): State => {
    return {...state, select: {...state.select, query: action.payload}};
  },
  [UPDATE_EXPECTED_DATABASE]: (state: State, action: Object): State => {
    return {...state, select: {...state.select, expectation: action.payload}};
  },
  [UPDATE_JSON]: (state: State, action: Object): State => {
    return {...state, request: {...state.request, [action.meta]: action.payload, validJson: {...state.request.validJson, [action.meta]: true}}};
  },
  [UPDATE_JSON_FAILED]: (state: State, action: Object): State => {
    return {...state, request: {...state.request, validJson: {...state.request.validJson, [action.meta]: false}}};
  },
  [UPDATE_DATABASE_INITALIZATION_QUERY]: (state: State, action: Object): State => {
    return {...state, insert: {...state.insert, query: action.payload}};
  },
  [POST_JSON_SUCCESS]: (state: State, action: Object): State => {
    return {...state, requestResponse: action.payload};
  },
  [POST_JSON_FAILED]: (state: State, action: Object): State => {
    return {...state, requestResponse: action.payload};
  },
  [INITIALIZE_DATABASE_SUCCESS]: (state: State, action: Object): State => {
    return {...state, databaseInsertResponse: action.payload};
  },
  [INITIALIZE_DATABASE_FAILED]: (state: State, action: Object): State => {
    return {...state, databaseInsertResponse: action.payload};
  }
}, init);

export default reducer;