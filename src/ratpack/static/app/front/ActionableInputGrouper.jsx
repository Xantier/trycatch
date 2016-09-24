import React from 'react';
import ActionableInput from './ActionableInput.jsx';
import DatabaseAssertionInput from './DatabaseAssertionInput.jsx';
import JsonTextArea from './JsonTextArea.jsx';
import IndividualStepContainer from './IndividualStepContainer.jsx';
import PrettyJsonComponent from './PrettyJsonComponent.jsx';
import Button from './Button.jsx';
import type {Request} from './reducer';

type Props = {
  postJson: () => void,
  initializeDatabase: () => void,
  assertDatabaseValues: () => void,
  updateExpected: () => void,
  updateSelect: () => void,
  updateInitializationScript: () => void,
  updateJson: () => void,
  saveScenario: () => void,
  runScenario: () => void,
  request: Request
}

export default (props: Props): React.Element => {
  const {postJson, initializeDatabase, assertDatabaseValues, updateExpected, updateSelect, saveScenario, runScenario, updateJson, updateInitializationScript} = props;
  return (
      <div className="todo">
        <IndividualStepContainer run={postJson}>
          <JsonTextArea updateJson={updateJson} {...props.request} />
        </IndividualStepContainer>
        <PrettyJsonComponent {...props.request}/>

        <IndividualStepContainer run={initializeDatabase}>
          <ActionableInput updateState={updateInitializationScript} placeholder="Insert DB script"/>
        </IndividualStepContainer>

        <IndividualStepContainer run={assertDatabaseValues}>
          <DatabaseAssertionInput updateExpected={updateExpected} updateSelect={updateSelect}/>
        </IndividualStepContainer>
        <Button action={saveScenario} text="Save scenario"/>
        <Button action={runScenario} text="Run scenario"/>
      </div>
  );
};