import {connect} from 'react-redux';
import ActionableInputGrouper from './ActionableInputGrouper.jsx';
import {postJson, initializeDatabase, assertDatabaseValues, updateExpected, updateSelect} from './actions';
import type {State} from './reducer';

const TodoListContainer = connect(
    function mapStateToProps(state: State): Object {
      return {todos: state};
    },
    function mapDispatchToProps(dispatch: () => void): Object {
      return {
        postJson: (text: string) => dispatch(postJson(text)),
        initializeDatabase: (text: string) => dispatch(initializeDatabase(text)),
        assertDatabaseValues: (text: string) => dispatch(assertDatabaseValues(text)),
        updateExpected: (text: string) => dispatch(updateExpected(text)),
        updateSelect: (text: string) => dispatch(updateSelect(text))
      };
    }
)(ActionableInputGrouper);

export default TodoListContainer;