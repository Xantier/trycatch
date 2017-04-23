import {connect} from 'react-redux';
import type {State, Scenario} from './reducer';

import React from 'react';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';

import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';

import IconButtonElement from './IconButtonElement.jsx';
import SelectableList from './SelectableList.jsx';
import {loadScenarios, selectScenario, newScenario, selectAndRunScenario} from './actions';
type Props = {
  newScenario: () => void,
  loadScenarios: () => void,
  selectScenario: () => void,
  selectAndRunScenario: () => void,
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
      return (
        <ListItem primaryText={it.name} key={it.name} value={it.name} onTouchTap={() => {
          this.props.selectScenario(it.name);
        }} rightIconButton={IconButtonElement({name: it.name, action: this.props.selectAndRunScenario})}
        />);
    });
    return (
      <div>
        <Drawer width={350} open={true}>
          <AppBar title="Try-Catch"/>
          <List>
            <ListItem key="new" onTouchTap={() => {
              this.props.newScenario();
            }} leftIcon={<FontIcon className="material-icons">note_add</FontIcon>}
            >New Scenario</ListItem>
          </List>
          <Divider/>
          <SelectableList defaultValue={scenarios[0] ? scenarios[0].name : null}>
            <Subheader>Existing Scenarios from disk</Subheader>
            {scenarioComponents}
          </SelectableList>
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
      selectScenario: (name: String) => dispatch(selectScenario(name)),
      selectAndRunScenario: (name: String) => dispatch(selectAndRunScenario(name))
    };
  }
)(Menu);

export default MenuConnector;
