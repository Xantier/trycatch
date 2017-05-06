import {connect} from 'react-redux';
import type {State, Scenario} from './reducer';

import React from 'react';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {pink600, red300, teal300} from 'material-ui/styles/colors';

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

const style = {
  refresh: {
    display: 'inline-block',
    position: 'relative'
  }
};

class Menu extends React.Component {
  constructor(props: Props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.props.loadScenarios();
  }

  render(): React.Element {
    const {scenarios, loading, running, status} = this.props;
    const scenarioComponents = scenarios.map((it: Scenario): MenuItem[] => {
      return (
          <ListItem primaryText={it.name} key={it.name} value={it.name} onTouchTap={() => {
            this.props.selectScenario(it.name);
          }} rightIconButton={IconButtonElement({name: it.name, action: this.props.selectAndRunScenario})}
          />);
    });
    const loadingComponent = (<RefreshIndicator
        size={50}
        left={70}
        top={0}
        status="loading"
        style={style.refresh}
    />);
    return (
        <div>
          <Drawer width={350} open={true}>
            <AppBar title="Try-Catch"
                    showMenuIconButton={false}
                    iconElementRight={running ? (<RefreshIndicator size={50} left={250} top={10} status="loading" color={pink600}/>) : null}
                    style={{'backgroundColor': status.success ? teal300 : red300}}
            />
            <List>
              <ListItem key="new" onTouchTap={() => {
                this.props.newScenario();
              }} leftIcon={<FontIcon className="material-icons">note_add</FontIcon>}
              >New Scenario</ListItem>
            </List>
            <Divider/>
            <SelectableList defaultValue={scenarios[0] ? scenarios[0].name : null}>
              <Subheader>Existing Scenarios from disk</Subheader>
              {loading ? loadingComponent : scenarioComponents}
            </SelectableList>
          </Drawer>
        </div>
    );
  }
}

const MenuConnector = connect(
    function mapStateToProps(state: State): Object {
      return {
        scenarios: state.scenarios,
        loading: state.loading,
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
)(Menu);

export default MenuConnector;
