import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';

type Props = {
  children: React.Element[],
  title: string,
  run: () => void
}
export default class IndividualStepContainer extends React.Component {

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
    const toggle = (<Toggle toggled={this.state.expanded} onToggle={this.handleToggle} labelPosition="right"
                            label={`Display ${this.props.title}`}/>);
    return (
        <div>
          <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
            <CardText>
              {toggle}
            </CardText>
            <CardText expandable={true}>
              {this.props.children}
              <CardActions>
                <RaisedButton onClick={this.props.run} label="Test Individual Step" icon={<AvPlayArrow/>} primary={true}/>
              </CardActions>
            </CardText>
          </Card>
        </div>
    );
  }
}
