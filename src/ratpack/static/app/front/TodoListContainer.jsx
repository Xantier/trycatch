import {connect} from 'react-redux';
import TodoList from './TodoList.jsx';
import {postJson, initializeDatabase} from './actions';
import type {State} from './reducer';

const TodoListContainer = connect(
    function mapStateToProps(state: State): Object {
      return {todos: state};
    },
    function mapDispatchToProps(dispatch: () => void) {
      return {
        addTodo: (text: string) => dispatch(postJson(text)),
        initializeDatabase: (text: string) => dispatch(initializeDatabase(text))
      };
    }
)(TodoList);

export default TodoListContainer;