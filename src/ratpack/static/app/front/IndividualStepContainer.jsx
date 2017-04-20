import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

type Props = {
  children: React.Element[],
  title: string,
  run: () => void
}

export default (props: Props): React.Element => {
  return (
    <div>
      <Card>
        <CardHeader title={props.title}/>
        <CardText>
          {props.children}
        </CardText>
        <CardActions>
          <RaisedButton onClick={props.run} label="Test Individual Step" icon={<AvPlayArrow/>} primary={true}/>
        </CardActions>
      </Card>
    </div>
  );
};
