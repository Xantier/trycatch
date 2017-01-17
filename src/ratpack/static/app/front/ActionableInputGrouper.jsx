import React from 'react';
import SqlInput from './SqlInput.jsx';
import DatabaseAssertionInput from './DatabaseAssertionInput.jsx';
import JsonTextArea from './request/JsonTextArea.jsx';
import PrettyJsonComponent from './request/PrettyJsonComponent.jsx';
import RequestComponent from './request/RequestComponent.jsx';
import RequestResultDisplayingComponent from './request/RequestResultDisplayingComponent.jsx';
import IndividualStepContainer from './IndividualStepContainer.jsx';
import RaisedButton from 'material-ui/RaisedButton';
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
  marginLeft: 350,
  width: 600
};
export default (props: Props): React.Element => {
  const {
    postJson, initializeDatabase, assertDatabaseValues, scenarioName,
    saveScenario, runScenario, updateInitializationScript, updateName, insert
  } = props;
  return (
    <div style={centralStyles}>
      <TextField hintText="Scenario Name" floatingLabelText="Enter name for the scenario"
                 value={scenarioName}
                 onChange={(e: Event) => {
                   updateName(e.target.value);
                 }}/>
      <IndividualStepContainer run={postJson}>
        <RequestComponent {...props} {...props.request}/>
        <JsonTextArea {...props} jsonString={props.request.payloadJson} label="Insert JSON payload"
                                 contentType="payload" {...props.request} />
        <PrettyJsonComponent payload={props.request.payload} validJson={props.request.validJson.payload}/>
        <JsonTextArea {...props} jsonString={props.request.expectationJson} label="Insert expected JSON"
                                 contentType="expectation" {...props.request} />
        <PrettyJsonComponent payload={props.request.expectation} validJson={props.request.validJson.payload}/>
        <RequestResultDisplayingComponent {...props.requestResponse} />
      </IndividualStepContainer>

      <IndividualStepContainer run={initializeDatabase}>
        <SqlInput updateFn={updateInitializationScript} label="Insert Statement"
                  placeholder="Insert DB insert statement" name={insert.name} query={insert.query}/>
      </IndividualStepContainer>

      <IndividualStepContainer run={assertDatabaseValues}>
        <DatabaseAssertionInput {...props}/>
      </IndividualStepContainer>
      <RaisedButton onClick={saveScenario} label="Save scenario" icon={<ContentSave/>} secondary={true}/>
      <RaisedButton onClick={runScenario} label="Run scenario" icon={<ContentSend/>} primary={true}/>
    </div>
  );
};