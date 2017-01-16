import {connect} from 'react-redux';
import ActionableInputGrouper from './ActionableInputGrouper.jsx';
import {
    postJson,
    initializeDatabase,
    assertDatabaseValues,
    updateExpected,
    updateSelect,
    updateJson,
    updateInitializationScript,
    saveScenario,
    runScenario,
    updateName,
    updateRequest
} from './actions';
import type {State} from './reducer';

const ScenarioForm = connect(
    function mapStateToProps(state: State): Object {
      return {
        request: state.active.request,
        requestResponse: state.active.requestResponse,
        select: state.active.select,
        insert: state.active.insert
      };
    },
    function mapDispatchToProps(dispatch: () => void): Object {
      return {
        postJson: (text: string) => dispatch(postJson(text)),
        initializeDatabase: (text: string) => dispatch(initializeDatabase(text)),
        assertDatabaseValues: (text: string) => dispatch(assertDatabaseValues(text)),
        updateExpected: (text: string) => dispatch(updateExpected(text)),
        updateSelect: (text: string) => dispatch(updateSelect(text)),
        updateJson: (value: string, contentType: string) => dispatch(updateJson(value, contentType)),
        updateInitializationScript: (text: string) => dispatch(updateInitializationScript(text)),
        updateName: (text: string) => dispatch(updateName(text)),
        updateRequest: (contentType: string, text: string, id?: number) => dispatch(updateRequest(contentType, text, id)),
        saveScenario: () => dispatch(saveScenario()),
        runScenario: () => dispatch(runScenario())
      };
    }
)(ActionableInputGrouper);

export default ScenarioForm;