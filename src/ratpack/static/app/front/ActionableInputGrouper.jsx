import React from 'react';
import SqlInput from './database/SqlInput.jsx';
import DatabaseInputComponent from './database/DatabaseInputComponent.jsx';
import JsonComponent from './request/JsonComponent.jsx';
import RequestComponent from './request/RequestComponent.jsx';
import RequestResultDisplayingComponent from './request/RequestResultDisplayingComponent.jsx';
import IndividualStepContainer from './IndividualStepContainer.jsx';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import ContentSave from 'material-ui/svg-icons/content/save';
import ContentSend from 'material-ui/svg-icons/content/send';

import TextField from 'material-ui/TextField';
import type {SqlInputType, Request} from './reducer';

type Props = {
  postJson: () => void,
  initializeDatabase: () => void,
  assertDatabaseValues: () => void,
  updateExpected: () => void,
  updateSelect: () => void,
  updateInitializationScript: () => void,
  updateJson: (value: string, contentType: string) => void,
  updateName: (value: string) => void,
  saveScenario: () => void,
  runScenario: () => void,
  updateRequest: () => void,
  insert: SqlInputType,
  request: Request,
  requestResponse: Object
}

const centralStyles = {
  marginLeft: 350
};
export default (props: Props): React.Element => {
  const {
            postJson, initializeDatabase, assertDatabaseValues, scenarioName,
            saveScenario, runScenario, updateInitializationScript, updateName, insert
        } = props;
  return (
      <div style={centralStyles}>

        <Card>
          <CardHeader title="Scenario Name"/>
          <CardText>
            <TextField hintText="Scenario Name" floatingLabelText="Enter name for the scenario"
                     value={scenarioName}
                     onChange={(e: Event) => {
                       updateName(e.target.value);
                     }}/>
          </CardText>
        </Card>
        <Divider/>

        <IndividualStepContainer run={postJson} title="Make HTTP Request">
          <RequestComponent {...props} {...props.request}/>
          {props.request.method !== 'GET' ?
              (<div>
                <h2>Payload</h2>
                <div>
                  <JsonComponent {...props} isRequest={true}/>
                </div>
                <div>
                  <JsonComponent {...props} isRequest={false}/>
                </div>
              </div>) : null
          }
          <RequestResultDisplayingComponent {...props.requestResponse} />
        </IndividualStepContainer>
        <Divider/>

        <IndividualStepContainer run={initializeDatabase} title="Initialize Database">
          <SqlInput updateFn={updateInitializationScript} label="Insert Statement"
                    placeholder="Insert DB insert statement" name={insert.name} query={insert.query}/>
        </IndividualStepContainer>
        <Divider/>

        <IndividualStepContainer run={assertDatabaseValues} title="Assert Database Values">
          <DatabaseInputComponent {...props}/>
        </IndividualStepContainer>
        <RaisedButton onClick={saveScenario} label="Save scenario" icon={<ContentSave/>} secondary={true}/>
        <RaisedButton onClick={runScenario} label="Run scenario" icon={<ContentSend/>} primary={true}/>
      </div>
  );
};