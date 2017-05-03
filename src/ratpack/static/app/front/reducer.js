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
    name: '',
    request: {
      validJson: {
        payload: true,
        expectation: true
      },
      url: '',
      method: '',
      payload: '',
      payloadJson: '',
      expectationJson: '',
      expectation: '',
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

const reducer = (state: State = init, action: Object): State => {
  switch (action.type) {
    case t.UPDATE_NAME:
      return {...state, active: {...state.active, name: action.payload}};

    case t.UPDATE_REQUEST:
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
    case t.UPDATE_DATABASE_ASSERTION_QUERY:
      return {...state, active: {...state.active, select: {...state.active.select, query: action.payload}}};
    case t.UPDATE_EXPECTED_DATABASE:
      return {...state, active: {...state.active, select: {...state.active.select, expectation: action.payload}}};
    case t.UPDATE_JSON:
      return {
        ...state, active: {
          ...state.active,
          request: {
            ...state.active.request,
            [action.meta]: action.payload,
            [`${action.meta}Json`]: action.rawPayload,
            validJson: {...state.active.request.validJson, [action.meta]: true}
          }
        }
      };
    case t.UPDATE_JSON_FAILED:
      return {
        ...state,
        active: {
          ...state.active,
          request: {
            ...state.active.request,
            [`${action.meta}Json`]: action.rawPayload,
            validJson: {...state.active.request.validJson, [action.meta]: false}
          }
        }
      };
    case t.UPDATE_DATABASE_INITALIZATION_QUERY:
      return {...state, active: {...state.active, insert: {...state.active.insert, query: action.payload}}};
    case t.POST_JSON_SUCCESS:
      return {...state, active: {...state.active, requestResponse: action.payload}};
    case t.POST_JSON_FAILED:
      return {...state, active: {...state.active, requestResponse: action.payload}};
    case t.INITIALIZE_DATABASE_SUCCESS:
      return {...state, active: {...state.active, insert: {...state.active.insert, databaseInsertResponse: action.payload}}};
    case t.INITIALIZE_DATABASE_FAILED:
      return {...state, active: {...state.active, insert: {...state.active.insert, databaseInsertResponse: action.payload}}};
    case t.ASSERT_DATABASE_VALUES_SUCCESS:
      return {...state, active: {...state.active, select: {...state.active.select, databaseAssertionResponse: action.response}}};
    case t.ASSERT_DATABASE_VALUES_FAILED:
      return {...state, active: {...state.active, select: {...state.active.select, databaseAssertionResponse: action.message}}};
    case t.LOAD_SCENARIOS:
      return {...state, loading: true};
    case t.LOAD_SCENARIOS_FAILED:
      return {...state, loading: false, errorMsg: action.payload};
    case t.LOAD_SCENARIOS_SUCCESS:
      return {...state, loading: false, scenarios: action.response};
    case t.SELECT_SCENARIO:
      return {...state, active: state.scenarios.find((it: Scenario) => it.name === action.payload)};
    case t.NEW_SCENARIO:
      return {...state, active: init.active};
    case t.SAVE_SCENARIO_SUCCESS:
      return {...state, scenarios: [...state.scenarios, action.response]};
    case t.RUN_SCENARIO_SUCCESS:
      return {...state};
    case t.RUN_SCENARIO_FAILED:
      return {...state};
    default:
      return state;
  }
};

export default reducer;