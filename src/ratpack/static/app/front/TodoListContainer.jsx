import {connect} from 'react-redux';
import TodoList from './TodoList.jsx';
import {postJson} from './actions';

const TodoListContainer = connect(
  function mapStateToProps(state) {
    return {todos: state};
  },
  function mapDispatchToProps(dispatch) {
    return {
      addTodo: text => dispatch(postJson(text)),
      toggleTodo: id => dispatch(postJson(id))
    };
  }
)(TodoList);

export default TodoListContainer;