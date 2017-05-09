import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import {grey700} from 'material-ui/styles/colors';

export default ({children}: React.Element): React.Element => (
    <div>
      <Card style={{backgroundColor: grey700}}>
        <CardText>
          {children}
        </CardText>
      </Card>
    </div>
);