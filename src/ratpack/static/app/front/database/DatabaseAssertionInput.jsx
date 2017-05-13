import React from 'react';
import TextField from 'material-ui/TextField';
import SqlInput from './SqlInput.jsx';

import type {SqlInputType} from '../../services/reducer';

type Props = {
  updateExpected: () => void,
  updateSelect: () => void,
  select: SqlInputType
}

export default (props: Props): React.Element => {
  const {updateExpected, updateSelect, select} = props;
  const {query, expectation} = select;
  const update = (text: String, action: () => void) => {
    action(text);
  };
  const sql = {
    query,
    placeholder: 'Insert Select Statement',
    label: 'DB Query',
    name: select.name
  };
  let expected = expectation;
  if (expectation instanceof Array) {
    expected = expectation.join('\n');
  }
  return (
      <div>
        <SqlInput {...sql} updateFn={updateSelect}/>
        <TextField
            floatingLabelText="Expected results"
            hintText="Insert Comma separated rows of expected results"
            floatingLabelFixed={true}
            rows={10}
            rowsMax={40}
            multiLine={true}
            fullWidth={true}
            value={expected}
            onChange={(e: Event) => update(e.target.value, updateExpected)}/>
      </div>
  );
};