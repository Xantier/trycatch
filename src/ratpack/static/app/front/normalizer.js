import type Scenario from './reducer';

const INSERT = 'INSERT';
const REQUEST = 'REQUEST';
const SELECT = 'SELECT';

const types = {
  [INSERT]: 'insert',
  [SELECT]: 'select'
};

type Step = {}
type BackendScenario = {
  steps: Step[]
}

export const normalizeScenarios = (scenarios: BackendScenario[]): Scenario[] => {
  return scenarios.map((it: BackendScenario): Scenario => {
    return it.steps.reduce((acc: Scenario, step: Step): Scenario => {
      switch (step.type) {
        case INSERT:
        case SELECT:
          return {
            ...acc,
            [types[step.type]]: {name: step.name, query: step.statement, expectation: step.expectation.value}
          };
        case REQUEST:
          return {
            ...acc, request: {
              name: step.name,
              validJson: {
                payload: true,
                expectation: true
              },
              url: step.request.path,
              method: step.request.method,
              params: Object.keys(step.request.params).map((key: string, idx: number): Object => {
                return {key: key, value: step.request.params[key], id: idx};
              }),
              payload: JSON.parse(step.payload),
              payloadJson: step.payload,
              expectation: JSON.parse(step.expectation.value.content),
              expectationJson: step.expectation.value.content
            }
          };
        default:
          return acc;
      }
    }, {name: it.name});
  });
};