import React, {Component} from 'react';
import {List, makeSelectable} from 'material-ui/List';

function wrapState(ComposedComponent: React.Element): React.Element {
  return class SelectableList extends Component {
    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue
      });
    }

    handleRequestChange = (_: any, index: number) => {
      this.setState({
        selectedIndex: index
      });
    };

    render(): React.Element {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

export default wrapState(makeSelectable(List));