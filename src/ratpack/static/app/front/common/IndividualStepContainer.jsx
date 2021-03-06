import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

type Props = {
  children: React.Element[],
  title: string,
  avatar: React.Element,
  run: () => void,
  withActions: boolean
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

  render(): React.Element {
    return (
        <div>
          <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
            <CardHeader
                avatar={this.props.avatar}
                title={this.props.title}
                actAsExpander={true}
                showExpandableButton={true}
            />
            <CardText expandable={true}>
              {this.props.children}
              {this.props.withActions ?
                  <CardActions>
                    <RaisedButton onClick={this.props.run} label="Test Individual Step" icon={<AvPlayArrow/>} primary={true}/>
                  </CardActions> : null}
            </CardText>
          </Card>
        </div>
    );
  }
}
