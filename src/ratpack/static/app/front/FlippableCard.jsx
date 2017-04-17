import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import './FlippableCard.scss';

export default class ExpandableCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      clicked: false
    };
  }

  handleToggle = (_, toggle) => {
    this.setState({expanded: toggle, clicked: true});
  };

  render() {
    let flippedCSS = this.state.expanded ? ' Card-Back-Flip' : ' Card-Front-Flip';
    if (!this.state.clicked) flippedCSS = '';
    return (
      <div className="Card">
        <div className={'Card-Front' + flippedCSS}>
          <Card>
            <Toggle
              toggled={this.state.expanded}
              onToggle={this.handleToggle}
              labelPosition="right"
              label={this.props.label}
            />
            <CardText>
              {this.props.content}
            </CardText>
          </Card>
        </div>
        <div className={'Card-Back' + flippedCSS}>
          <Card>
            <Toggle
              toggled={this.state.expanded}
              onToggle={this.handleToggle}
              labelPosition="right"
              label={this.props.label}
            />
            <CardText>
              {this.props.expandable}
            </CardText>
          </Card>

        </div>
      </div>
    );
  }
}