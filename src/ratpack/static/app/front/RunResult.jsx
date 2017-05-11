import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import {grey700} from 'material-ui/styles/colors';
import type Result from './reducer';

type Props = {
  result: Result,
  number: number
}
export default ({number, result}: Props): React.Element => {
  const stepResults = result[number].map((it: Result): React.Component => {
    const key = it.stepIdentifier + number;
    return (
        <div key={key}>
          <span>Identifier: {it.stepIdentifier}</span>
          <span>Was success: {it.success}</span>
          <span>response: {Object.keys(it.response).map((jey: any) => <div key={jey}>{it.response[jey]}<br/></div>)}</span>
        </div>);
  });
  return (
      <div>
        <div>{stepResults}</div>
        <Card style={{backgroundColor: grey700}}>
          <CardText/>
        </Card>
      </div>
  );
};
