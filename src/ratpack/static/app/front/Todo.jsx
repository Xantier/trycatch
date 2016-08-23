import React from 'react';

export default (props: {todo: Object}): React.Element => {
  const {todo} = props;

  if (todo.isDone) {
    return <strike>{todo.text}</strike>;
  }
  return <span>{todo.text}</span>;
};