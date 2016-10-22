import React from 'react';
import ActionableInput from './ActionableInput.jsx';
import DatabaseAssertionInput from './DatabaseAssertionInput.jsx';
import JsonTextArea from './request/JsonTextArea.jsx';
import PrettyJsonComponent from './request/PrettyJsonComponent.jsx';
import RequestComponent from './request/RequestComponent.jsx';
import RequestResultDisplayingComponent from './request/RequestResultDisplayingComponent.jsx';
import IndividualStepContainer from './IndividualStepContainer.jsx';
import Button from './Button.jsx';
import TextField from 'material-ui/TextField';
import type {Request, Select} from './reducer';

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
  request: Request,
  requestResponse: Object[],
  select: Select
}

export default (props: Props): React.Element => {
  const {
            postJson, initializeDatabase, assertDatabaseValues,
            saveScenario, runScenario, updateInitializationScript, updateName
        } = props;
  return (
      <div className="todo">
        <TextField hintText="Scenario Name" floatingLabelText="Enter name for the scenario"
                   onChange={(e: Event) => {
                     updateName(e.target.value);
                   }}/>
        <IndividualStepContainer run={postJson}>
          <RequestComponent {...props} {...props.request}/>
          <JsonTextArea {...props} label="Insert JSON payload" contentType="payload" {...props.request} />
          <PrettyJsonComponent payload={props.request.payload} validJson={props.request.validJson.payload}/>
          <JsonTextArea {...props} label="Insert expected JSON" contentType="expectation" {...props.request} />
          <PrettyJsonComponent payload={props.request.expectation} validJson={props.request.validJson.payload}/>
          <RequestResultDisplayingComponent {...props.requestResponse} />
        </IndividualStepContainer>

        <IndividualStepContainer run={initializeDatabase}>
          <ActionableInput updateState={updateInitializationScript} placeholder="Insert DB script"/>
        </IndividualStepContainer>

        <IndividualStepContainer run={assertDatabaseValues}>
          <DatabaseAssertionInput {...props}/>
        </IndividualStepContainer>
        <Button action={saveScenario} text="Save scenario"/>
        <Button action={runScenario} text="Run scenario"/>
      </div>
  );
};