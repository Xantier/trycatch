import React from 'react';
import ActionableInput from './ActionableInput.jsx';
import DatabaseAssertionInput from './DatabaseAssertionInput.jsx';

type Props = {
  postJson: () => void,
  initializeDatabase: () => void,
  assertDatabaseValues: () => void,
  updateExpected: () => void,
  updateSelect: () => void
}

export default (props: Props): React.Element => {
  const {postJson, initializeDatabase, assertDatabaseValues, updateExpected, updateSelect} = props;
  return (
      <div className="todo">
        <ActionableInput action={postJson} placeholder="Insert JSON"/>
        <ActionableInput action={initializeDatabase} placeholder="Insert DB script"/>
        <DatabaseAssertionInput submit={assertDatabaseValues} updateExpected={updateExpected} updateSelect={updateSelect}/>
      </div>
  );
};