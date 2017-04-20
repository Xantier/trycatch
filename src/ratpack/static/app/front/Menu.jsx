import {connect} from 'react-redux';
import type {State, Scenario} from './reducer';

import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {loadScenarios, selectScenario, newScenario} from './actions';
type Props = {
  loadScenarios: () => void,
  selectScenario: () => void,
  scenarios: Array
}

class Menu extends React.Component {
  constructor(props: Props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.props.loadScenarios();
  }

  render(): React.Element {
    const {scenarios} = this.props;
    const scenarioComponents = scenarios.map((it: Scenario): MenuItem[] => {
      return (<MenuItem key={it.name} onTouchTap={() => {
        this.props.selectScenario(it.name);
      }}>{it.name}</MenuItem>);
    });
    return (
      <div>
        <Drawer width={300} open={true}>
          <MenuItem key="new" onTouchTap={() => {
            this.props.newScenario();
          }}>New Scenario</MenuItem>
          {scenarioComponents}
        </Drawer>
      </div>
    );
  }
}

const MenuConnector = connect(
  function mapStateToProps(state: State): Object {
    return {
      scenarios: state.scenarios
    };
  },
  function mapDispatchToProps(dispatch: () => void): Object {
    return {
      loadScenarios: () => dispatch(loadScenarios()),
      newScenario: () => dispatch(newScenario()),
      selectScenario: (name: String) => dispatch(selectScenario(name))
    };
  }
)(Menu);

export default MenuConnector;
