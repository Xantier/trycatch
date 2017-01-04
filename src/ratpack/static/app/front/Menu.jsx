import {connect} from 'react-redux';
import type {State} from './reducer';

import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {loadScenarios, selectScenario} from './actions';
type Props = {
  loadScenarios: () => void,
  selectScenario: () => void,
  scenarios: Array
}

class Menu extends React.Component {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    props.loadScenarios();
  }

  render(): React.Element {
    const {scenarios} = this.props;
    const scenarioComponents = scenarios.map((it) => {
      return (<MenuItem key={it.name} onTouchTap={() => {
        console.log(`Opening Item ${it.name}`);
        this.props.selectScenario(it.name);
      }}>{it.name}</MenuItem>);
    });
    return (
      <div>
        <Drawer width={300} open={true}>
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
      selectScenario: (name) => dispatch(selectScenario(name))
    };
  }
)(Menu);

export default MenuConnector;
