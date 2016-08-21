import React from 'react';

const Todo = (props) => {
  const {todo} = props;

  if (todo.isDone) {
    return <strike>{todo.text}</strike>;
  }
  return <span>{todo.text}</span>;

};

Todo.propTypes = {
  todo: React.PropTypes.object
};

export default Todo;