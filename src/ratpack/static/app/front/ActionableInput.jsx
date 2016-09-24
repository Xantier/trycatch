import React from 'react';

type Props = {
  updateState: () => void,
  placeholder: String
}

export default (props: Props): React.Element => {
  const {placeholder, updateState} = props;
  return (
      <input type="text" className="todo__entry" placeholder={placeholder} onChange={(e: Event) => updateState(e.target.value)}/>
  );
};