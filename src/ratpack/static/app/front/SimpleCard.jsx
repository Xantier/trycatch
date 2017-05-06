import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import {grey700} from 'material-ui/styles/colors';

export default class SimpleCard extends React.Component {
  render(): React.Element {
    return (
      <div>
        <Card style={{backgroundColor: grey700}}>
          <CardText>
            {this.props.children}
          </CardText>
        </Card>
      </div>
    );
  }
}