import React from 'react';
import ActionableInput from './ActionableInput.jsx';
import DatabaseAssertionInput from './DatabaseAssertionInput.jsx';
import JsonTextArea from './JsonTextArea.jsx';
import SaveButton from './SaveButton.jsx';

type Props = {
  postJson: () => void,
  initializeDatabase: () => void,
  assertDatabaseValues: () => void,
  updateExpected: () => void,
  updateSelect: () => void,
  updateInitializationScript: () => void,
  updateJson: () => void,
  saveScenario: () => void
}

export default (props: Props): React.Element => {
  const {postJson, initializeDatabase, assertDatabaseValues, updateExpected, updateSelect, saveScenario, updateJson, updateInitializationScript} = props;
  return (
      <div className="todo">
        <ActionableInput action={postJson} updateState={updateJson} placeholder="Insert JSON"/>
        <ActionableInput action={initializeDatabase} updateState={updateInitializationScript} placeholder="Insert DB script"/>
        <DatabaseAssertionInput submit={assertDatabaseValues} updateExpected={updateExpected} updateSelect={updateSelect}/>
        <JsonTextArea/>
        <SaveButton saveAction={saveScenario}/>
      </div>
  );
};