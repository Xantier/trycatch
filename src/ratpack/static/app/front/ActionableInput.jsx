import React from 'react';

type Props = {
  action: () => void,
  placeholder: String
}

export default (props: Props): React.Element => {
  const {action, placeholder} = props;
  const onSubmit = (e: Event) => {
    const input = e.target;
    const text: string = input.value;
    const isEnterKey: boolean = (e.which === 13);
    const isLongEnough: boolean = text.length > 0;
    console.log('fdadfsfds');
    if (isEnterKey && isLongEnough) {
      input.value = '';
      action(text);
    }
  };
  return (
      <input type="text" className="todo__entry" placeholder={placeholder} onKeyDown={onSubmit}/>
  );
};