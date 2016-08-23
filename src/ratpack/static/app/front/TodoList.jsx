import React from 'react';

type Props = {
  addTodo: () => void,
  initializeDatabase: () => void
}

export default (props: Props): React.Element => {
  const {addTodo, initializeDatabase} = props;

  const onSubmit = (e: Event) => {
    const input = e.target;
    const text: string = input.value;
    const isEnterKey: boolean = (e.which === 13);
    const isEscKey: boolean = (e.which === 27);
    const isLongEnough: boolean = text.length > 0;

    if (isEscKey) {
      input.value = '';
      initializeDatabase(text);
    } else if (isEnterKey && isLongEnough) {
      input.value = '';
      addTodo(text);
    }
  };
  return (
      <div className="todo">
        <input type="text"
               className="todo__entry"
               placeholder="Add todo"
               onKeyDown={onSubmit}/>

        <input type="text"
               className="todo__entry"
               placeholder="Insert DB script"
               onKeyDown={onSubmit}/>
      </div>
  );
};