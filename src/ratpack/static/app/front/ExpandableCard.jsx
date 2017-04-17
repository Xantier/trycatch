import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';

export default class ExpandableCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  render() {
    const toggle = this.props.canExpand ?
      (<Toggle toggled={this.state.expanded} onToggle={this.handleToggle} labelPosition="right"
               label={this.props.label}/>) : null;
    return (
      <div>
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
          <CardText>
            {this.props.content}
            {toggle}
          </CardText>
          <CardText expandable={true}>
            {this.props.expandable}
          </CardText>
        </Card>
      </div>
    );
  }
}