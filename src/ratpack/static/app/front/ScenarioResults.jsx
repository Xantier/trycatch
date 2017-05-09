import {connect} from 'react-redux';
import type {State, Scenario} from './reducer';

import React from 'react';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import {Card, CardText} from 'material-ui/Card';
import RunResult from './RunResult.jsx';
import IndividualStepContainer from './IndividualStepContainer.jsx';
import {loadScenarios, selectScenario, newScenario, selectAndRunScenario} from './actions';
type Props = {
  newScenario: () => void,
  loadScenarios: () => void,
  selectScenario: () => void,
  selectAndRunScenario: () => void,
  scenarios: Array
}

const style = {
  refresh: {
    display: 'inline-block',
    position: 'relative'
  }
};

class ScenarioResults extends React.Component {

  render(): React.Element {
    const {scenarios, loading, running, status} = this.props;
    return (
        <div>
          <Toolbar>
            <ToolbarTitle text="Scenario Results"/>
          </Toolbar>
          <IndividualStepContainer title="scenario name run #" withActions={false}>
            <div>
              result<br/>
              result<br/>
              result<br/>
              result<br/>
              result<br/>
            </div>
          </IndividualStepContainer>
          <RunResult />
        </div>
    );
  }
}

const ResultConnector = connect(
    function mapStateToProps(state: State): Object {
      return {
        scenarios: state.scenarios,
        results: state.results,
        running: state.running,
        status: state.status
      };
    },
    function mapDispatchToProps(dispatch: () => void): Object {
      return {
        loadScenarios: () => dispatch(loadScenarios()),
        newScenario: () => dispatch(newScenario()),
        selectScenario: (name: String) => dispatch(selectScenario(name)),
        selectAndRunScenario: (name: String) => dispatch(selectAndRunScenario(name))
      };
    }
)(ScenarioResults);

export default ResultConnector;
