import {connect} from 'react-redux';
import type {State, Scenario} from './reducer';

import React from 'react';
import {Toolbar, ToolbarTitle, ToolbarGroup} from 'material-ui/Toolbar';
import AppBar from 'material-ui/AppBar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {pink600, red300, teal300} from 'material-ui/styles/colors';
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
    const {active, results, running, status} = this.props;
    const ResultComponents = results.map((it) => <RunResult key={it.identifier} {...it}/>);
    return (
      <div>
        <Toolbar style={{'backgroundColor': status.success ? teal300 : red300}}>
          <ToolbarGroup>
            <ToolbarTitle text="Scenario Results"/>
          </ToolbarGroup>
          <ToolbarGroup>
            {running ? (
              <RefreshIndicator size={50} left={250} top={10} status="loading" color={pink600}/>
            ) : null}
          </ToolbarGroup>

        </Toolbar>
        <IndividualStepContainer title="scenario name run #" withActions={false}>
          {ResultComponents}
        </IndividualStepContainer>

      </div>
    );
  }
}

const ResultConnector = connect(
  function mapStateToProps(state: State): Object {
    return {
      active: state.active,
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
