import {connect} from 'react-redux';
import type {State} from './reducer';

import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {loadScenarios} from './actions';
type Props = {
  loadScenarios: () => void
}

class Menu extends React.Element {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    props.loadScenarios();
  }

  render() {
    const {scenarios} = this.props;
    const scenarioComponents = scenarios.map((it) => {
      return <MenuItem onTouchTap={() => {console.log(`Opening Item ${it.name}`);}}>{it.name}</MenuItem>;
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
      loadScenarios: () => dispatch(loadScenarios())
    };
  }
)(Menu);

export default MenuConnector;
