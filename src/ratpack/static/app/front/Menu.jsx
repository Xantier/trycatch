import {connect} from 'react-redux';
import type {State} from './reducer';

import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {loadScenarios} from './actions';
type Props = {
  loadScenarios: () => void
}

const Menu = (props: Props): React.Element => {
  props.loadScenarios();
  return (
      <div>
        <Drawer width={300} open={true}>
          <MenuItem onTouchTap={() => {console.log('Opening Item 1');}}>Menu Item</MenuItem>
          <MenuItem onTouchTap={() => {console.log('Opening Item 2');}}>Menu Item 2</MenuItem>
        </Drawer>
      </div>
  );
};

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
