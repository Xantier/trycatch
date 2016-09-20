import React from 'react';
import ActionableInput from './ActionableInput.jsx';
import DatabaseAssertionInput from './DatabaseAssertionInput.jsx';
import JsonTextArea from './JsonTextArea.jsx';
import PrettyJsonComponent from './PrettyJsonComponent.jsx';
import SaveButton from './SaveButton.jsx';
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
  request: Request
}

export default (props: Props): React.Element => {
  const {postJson, initializeDatabase, assertDatabaseValues, updateExpected, updateSelect, saveScenario, updateJson, updateInitializationScript} = props;
  return (
      <div className="todo">
        <JsonTextArea updateJson={updateJson} {...props.request} />
        <PrettyJsonComponent {...props.request}/>
        <ActionableInput action={initializeDatabase} updateState={updateInitializationScript} placeholder="Insert DB script"/>
        <DatabaseAssertionInput submit={assertDatabaseValues} updateExpected={updateExpected} updateSelect={updateSelect}/>
        <SaveButton saveAction={saveScenario}/>
      </div>
  );
};