import {connect} from 'react-redux';
import type {State} from '../../services/reducer';

import React from 'react';
import {Toolbar, ToolbarTitle, ToolbarGroup} from 'material-ui/Toolbar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import {pink600, red300, teal300, green500, red500} from 'material-ui/styles/colors';
import RunResult from './RunResult.jsx';
import IndividualStepContainer from '../common/IndividualStepContainer.jsx';
import {loadScenarios, selectScenario, newScenario, selectAndRunScenario} from '../../services/actions';

class ScenarioResults extends React.Component {

  render(): React.Element {
    const {active, results, running, status} = this.props;
    const success = status.every((it: Object) => it.success);
    const ResultComponents = Object.keys(results).map((key: number): React.Element => {
      const successfulResult = results[key][key].every((stepResult: Object): boolean => stepResult.success);
      const icon = successfulResult ?
          <FontIcon className="material-icons" color={green500}>done</FontIcon>
          : <FontIcon className="material-icons" color={red500}>error</FontIcon>;
      const avatar = <Avatar icon={icon} color={successfulResult ? teal300 : red300} size={30}/>;
      return (
          <IndividualStepContainer key={results[key].identifier + key}
                                   title={active.name + ' run ' + (parseInt(key, 10) + 1)}
                                   avatar={avatar}
                                   withActions={false}>
            <RunResult result={results[key]} number={key}/>
          </IndividualStepContainer>);
    });
    return (
        <div>
          <Toolbar style={{'backgroundColor': success ? teal300 : red300}}>
            <ToolbarGroup>
              <ToolbarTitle text="Results"/>
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
