import {connect} from 'react-redux';
import type {State, Scenario} from './reducer';

import React from 'react';
import {Toolbar, ToolbarTitle, ToolbarGroup} from 'material-ui/Toolbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {pink600, red300, teal300} from 'material-ui/styles/colors';
import {Card, CardText} from 'material-ui/Card';
import RunResult from './RunResult.jsx';
import IndividualStepContainer from './IndividualStepContainer.jsx';
import {loadScenarios, selectScenario, newScenario, selectAndRunScenario} from './actions';

type Result = {
  number: number,
  value: Object
}

class ScenarioResults extends React.Component {

  render(): React.Element {
    const {active, results, running, status} = this.props;
    const ResultComponents = Object.keys(results).map((key: number): React.Element => {
      return (
          <IndividualStepContainer key={results[key].identifier + key} title={active.name + ' run ' + key} withActions={false}>
            <RunResult result={results[key]} number={key}/>
          </IndividualStepContainer>);
    });
    return (
        <div>
          <Toolbar style={{'backgroundColor': status.success ? teal300 : red300}}>
            <ToolbarGroup>
              <ToolbarTitle text="Scenario"/>
            </ToolbarGroup>
            <ToolbarGroup>
              {running ? (
                  <RefreshIndicator size={50} left={250} top={10} status="loading" color={pink600}/>
              ) : null}
            </ToolbarGroup>
          </Toolbar>
          {ResultComponents}
        </div>
    );
  }
}

const ResultConnector = connect(
    function mapStateToProps(state: State): Object {
      return {
        active: state.active,
        results: state.results[state.active.name] || [],
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
