import React from 'react';
import StepResult from './StepResult.jsx';
import type Result from '../../services/reducer';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import {stepIcon, stepLabel} from '../../services/helpers';

type Props = {
  result: Result,
  number: number
}
export default ({result, number}: Props): React.Element => {
  return (
      <Tabs tabItemContainerStyle={{height: 55}}>
        {result[number].map((it: Result): React.Element => {
          const key = it.stepIdentifier + number;
          return (
              <Tab key={key} icon={<FontIcon className="material-icons">{stepIcon(it.stepIdentifier)}</FontIcon>}
                   label={stepLabel(it.stepIdentifier)}
                   buttonStyle={{marginTop: -10}}>
                <StepResult result={it}/>
              </Tab>
          );
        })}
      </Tabs>
  );
};