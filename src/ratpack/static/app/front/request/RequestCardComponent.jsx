import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import RequestResultDisplayingComponent from './RequestResultDisplayingComponent.jsx';

export default class CardExampleControlled extends React.Component {

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

  handleExpand = () => {
    this.setState({expanded: true});
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };

  render() {
    return (
      <div style={{float: 'left'}}>
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
          <CardHeader actAsExpander={true}
                      showExpandableButton={true}
          />
          <CardText>
            <Toggle
              toggled={this.state.expanded}
              onToggle={this.handleToggle}
              labelPosition="right"
              label="Display Results"
            />
          </CardText>
          <CardText expandable={true}>

          </CardText>
          <CardActions>
            <FlatButton label="Expand" onTouchTap={this.handleExpand}/>
            <FlatButton label="Reduce" onTouchTap={this.handleReduce}/>
          </CardActions>
        </Card>
      </div>
    );
  }
}