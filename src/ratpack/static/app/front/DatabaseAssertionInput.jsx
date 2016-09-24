import React from 'react';

type Props = {
  updateExpected: () => void,
  updateSelect: () => void
}

export default (props: Props): React.Element => {
  const {updateExpected, updateSelect} = props;
  const update = (e: Event, action: () => void) => {
    const input = e.target;
    const text: string = input.value;
    action(text);
  };
  return (
      <div>
        <input type="text" className="todo__entry" placeholder="Insert Select Statement" onChange={(e: Event) => update(e, updateSelect)}/>
        <input type="text" className="todo__entry" placeholder="Insert Pipe separated results" onChange={(e: Event) => update(e, updateExpected)}/>
      </div>
  );
};