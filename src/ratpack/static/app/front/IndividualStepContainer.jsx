import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Toggle from 'material-ui/Toggle';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

type Props = {
  children: React.Element[],
  run: () => void
}

export default class IndividualStepContainer extends React.Component {

  constructor(props: Props) {
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
    return (
      <div>
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
          <CardHeader title={this.props.title}/>
          <CardText>
            {this.props.children}
          </CardText>
          <CardActions>
            <RaisedButton onClick={this.props.run} label="Test Individual Step" icon={<AvPlayArrow/>} primary={true}/>
          </CardActions>
          <Toggle
            toggled={this.state.expanded}
            onToggle={this.handleToggle}
            labelPosition="right"
            label={this.props.label}
          />
          <CardText expandable={true}>
            {this.props.expandable}
          </CardText>
        </Card>
      </div>
    );
  }
}
