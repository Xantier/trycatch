import {handleActions} from 'redux-actions';
import * as t from './constants';

export type Request = {
  payload: string,
  expectation: string,
  validJson: Object[],
  url: string,
  method: string,
  params: Object[]
}

export type SqlInputType = {
  query: string,
  expectation: string
}

export type Scenario = {
  name: string,
  select: SqlInputType,
  request: Request,
  requestResponse: Object,
  insert: SqlInputType
};

export type State = {
  active: Scenario,
  scenarios: Array<Scenario>,
  loading: boolean
};

const init = {
  active: {
    request: {
      validJson: {
        payload: true,
        expectation: true
      },
      url: '',
      method: '',
      params: []
    },
    select: {
      query: '',
      expectation: ''
    },
    insert: {
      query: '',
      expectation: ''
    }
  },
  scenarios: [],
  loading: false
};

function updateHeader(params: Object[], action: Object): Object {
  if (action.meta.contentType.endsWith('add')) {
    return [...params, {key: '', value: '', id: params.length + 1}];
  }
  return params.map((it: Object): Object => {
    if (it.id === action.meta.id) {
      return action.meta.contentType.endsWith('key') ? {...it, key: action.payload} : {...it, value: action.payload};
    }
    return it;
  });
}

const reducer = handleActions({
  [t.UPDATE_NAME]: (state: State, action: Object): State => {
    return {...state, active: {...state.active, name: action.payload}};
  },
  [t.UPDATE_REQUEST]: (state: State, action: Object): State => {
    if (action.meta.contentType.startsWith('header')) {
      return {
        ...state,
        active: {
          ...state.active,
          request: {...state.active.request, params: updateHeader(state.active.request.params, action)}
        }
      };
    }
    return {
      ...state,
      active: {...state.active, request: {...state.active.request, [action.meta.contentType]: action.payload}}
    };
  },
  [t.UPDATE_DATABASE_ASSERTION_QUERY]: (state: State, action: Object): State => {
    return {...state, active: {...state.active, select: {...state.active.select, query: action.payload}}};
  },
  [t.UPDATE_EXPECTED_DATABASE]: (state: State, action: Object): State => {
    return {...state, active: {...state.active, select: {...state.active.select, expectation: action.payload}}};
  },
  [t.UPDATE_JSON]: (state: State, action: Object): State => {
    return {
      ...state, active: {
        ...state.active,
        request: {
          ...state.active.request,
          [action.meta]: action.payload,
          validJson: {...state.active.request.validJson, [action.meta]: true}
        }
      }
    };
  },
  [t.UPDATE_JSON_FAILED]: (state: State, action: Object): State => {
    return {
      ...state,
      active: {
        ...state.active,
        request: {...state.active.request, validJson: {...state.active.request.validJson, [action.meta]: false}}
      }
    };
  },
  [t.UPDATE_DATABASE_INITALIZATION_QUERY]: (state: State, action: Object): State => {
    return {...state, active: {...state.active, insert: {...state.active.insert, query: action.payload}}};
  },
  [t.POST_JSON_SUCCESS]: (state: State, action: Object): State => {
    return {...state, active: {...state.active, requestResponse: action.payload}};
  },
  [t.POST_JSON_FAILED]: (state: State, action: Object): State => {
    return {...state, active: {...state.active, requestResponse: action.payload}};
  },
  [t.INITIALIZE_DATABASE_SUCCESS]: (state: State, action: Object): State => {
    return {...state, active: {...state.active, databaseInsertResponse: action.payload}};
  },
  [t.INITIALIZE_DATABASE_FAILED]: (state: State, action: Object): State => {
    return {...state, active: {...state.active, databaseInsertResponse: action.payload}};
  },
  [t.LOAD_SCENARIOS]: (state: State): State => {
    return {...state, loading: true};
  },
  [t.LOAD_SCENARIOS_FAILED]: (state: State, action: Object): State => {
    return {...state, loading: false, errorMsg: action.payload};
  },
  [t.LOAD_SCENARIOS_SUCCESS]: (state: State, action: Object): State => {
    return {...state, loading: false, scenarios: action.response};
  },
  [t.SELECT_SCENARIO]: (state: State, action: Object): State => {
    return {...state, active: state.scenarios.find((it: Scenario) => it.name === action.payload)};
  }
}, init);

export default reducer;