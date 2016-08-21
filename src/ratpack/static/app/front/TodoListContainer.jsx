import {connect} from 'react-redux';
import TodoList from './TodoList.jsx';
import {addTodo, toggleTodo} from './actions';

const TodoListContainer = connect(
  function mapStateToProps(state) {
    return {todos: state};
  },
  function mapDispatchToProps(dispatch) {
    return {
      addTodo: text => dispatch(addTodo(text)),
      toggleTodo: id => dispatch(toggleTodo(id))
    };
  }
)(TodoList);

export default TodoListContainer;