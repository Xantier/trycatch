import * as t from './constants';
import {normalizeScenarios as normalize} from './normalizer';

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

export type Notification = {
  open: boolean,
  isError: boolean,
  message: string
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
  loading: boolean,
  running: boolean,
  notification: Notification
};

export type Result = {
  stepIdentifier: string,
  success: boolean,
  response: Object
};

const init = {
  active: {
    runs: 0,
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
  loading: false,
  running: false,
  status: {
    success: true,
    error: null,
    errorMessage: null
  },
  notification: {
    open: false,
    message: '',
    isError: false
  },
  results: {}
};

function updateHeader(params: Object[], action: Object): Object {
  if (action.meta.contentType.endsWith('add')) {
    return [...params, {key: '', value: '', id: params.length + 1}];
  }
  if (action.meta.contentType.endsWith('delete')) {
    return params.filter((it: Object) => it.id !== action.meta.id);
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
      return {
        ...state,
        active: {...state.active, insert: {...state.active.insert, databaseInsertResponse: action.payload}}
      };
    case t.INITIALIZE_DATABASE_FAILED:
      return {
        ...state,
        active: {...state.active, insert: {...state.active.insert, databaseInsertResponse: action.payload}}
      };
    case t.ASSERT_DATABASE_VALUES_SUCCESS:
      return {
        ...state,
        active: {...state.active, select: {...state.active.select, databaseAssertionResponse: action.payload}}
      };
    case t.ASSERT_DATABASE_VALUES_FAILED:
      return {
        ...state,
        active: {...state.active, select: {...state.active.select, databaseAssertionResponse: action.payload}}
      };
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
      return {
        ...state, scenarios: state.scenarios.find((it: Scenario) => it.name === action.response.name) === null ?
            [...state.scenarios, normalize([action.response])]
            : state.scenarios.map((it: Scenario): Scenario => {
              if (it.name === action.response.name) {
                return normalize([action.response])[0];
              }
              return it;
            })
      };
    case t.RUN_SCENARIO:
    case t.SELECT_AND_RUN_SCENARIO:
      return {...state, running: true, active: {...state.active}};
    case t.RUN_SCENARIO_SUCCESS:
    case t.RUN_SCENARIO_FAILED:
      const resultContainer = state.results[action.scenario.name];
      const results = resultContainer ? [...resultContainer, {[resultContainer.length]: action.payload}] : [{0: action.payload}];
      return {
        ...state,
        running: false,
        status: action.payload,
        results: {
          ...state.results,
          [action.scenario.name]: results
        }
      };
    case t.ADD_NOTIFICATION:
      return {...state, notification: {open: true, message: action.payload, isError: action.isError}};
    case t.CLOSE_NOTIFICATION:
      return {...state, notification: {open: false, message: '', isError: false}};
    default:
      return state;
  }
};

export default reducer;