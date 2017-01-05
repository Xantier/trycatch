import React from 'react';
import SqlInput from './SqlInput.jsx';

import type {SqlInputType} from './reducer';

type Props = {
  updateExpected: () => void,
  updateSelect: () => void,
  select: SqlInputType
}

export default (props: Props): React.Element => {
  const {updateExpected, updateSelect, select} = props;
  const {query} = select;
  const update = (text: String, action: () => void) => {
    action(text);
  };
  const sql = {
    query,
    placeholder: 'Insert Select Statement',
    label: 'DB Query'
  };

  return (
      <div>
        <SqlInput {...sql} updateFn={updateSelect}/>
        <input type="text" placeholder="Insert Pipe separated results" onChange={(e: Event) => update(e.target.value, updateExpected)}/>
      </div>
  );
};