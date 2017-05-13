import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import {grey700} from 'material-ui/styles/colors';

type State = {
  expanded: boolean
};

type Props = {
  expandable: React.Element,
  content: React.Element,
  label: string
};

export default class ExpandableCard extends React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleExpandChange = (expanded: boolean): State => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event: any, toggle: boolean): State => {
    this.setState({expanded: toggle});
  };

  render(): React.Element {
    const toggle = this.props.canExpand ?
      (<Toggle toggled={this.state.expanded} onToggle={this.handleToggle} labelPosition="right"
               label={this.props.label}/>) : null;
    return (
      <div>
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange} style={{backgroundColor: grey700}}>
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