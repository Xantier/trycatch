import {connect} from 'react-redux';
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
import React from 'react';
import SqlInput from './database/SqlInput.jsx';
import DatabaseInputComponent from './database/DatabaseInputComponent.jsx';
import SuccessFailResultComponent from './database/SuccessFailResultComponent.jsx';
import JsonComponent from './request/JsonComponent.jsx';
import RequestComponent from './request/RequestComponent.jsx';
import RequestResultDisplayingComponent from './request/RequestResultDisplayingComponent.jsx';
import IndividualStepContainer from './IndividualStepContainer.jsx';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import ContentSave from 'material-ui/svg-icons/content/save';
import ContentSend from 'material-ui/svg-icons/content/send';

import TextField from 'material-ui/TextField';
import type {SqlInputType, Request} from './reducer';

import type {State} from './reducer';

type Props = {
  postJson: () => void,
  initializeDatabase: () => void,
  assertDatabaseValues: () => void,
  updateExpected: () => void,
  updateSelect: () => void,
  updateInitializationScript: () => void,
  updateJson: (value: string, contentType: string) => void,
  updateName: (value: string) => void,
  saveScenario: () => void,
  runScenario: () => void,
  updateRequest: () => void,
  insert: SqlInputType,
  request: Request,
  requestResponse: Object
}

const centralStyles = {
  marginLeft: 350
};
const form = (props: Props): React.Element => {
  const {insert} = props;
  return (
      <div style={centralStyles}>

        <Card>
          <CardHeader title="Scenario Name"/>
          <CardText>
            <TextField hintText="Scenario Name" floatingLabelText="Enter name for the scenario"
                       value={props.scenarioName}
                       onChange={(e: Event) => {
                         props.updateName(e.target.value);
                       }}/>
          </CardText>
        </Card>
        <Divider/>

        <IndividualStepContainer run={props.postJson} title="Make HTTP Request">
          <RequestComponent {...props} {...props.request}/>
          {props.request && props.request.method !== 'GET' ?
              (<div>
                <h2>Payload</h2>
                <div>
                  <JsonComponent {...props} isRequest={true}/>
                </div>
                <div>
                  <JsonComponent {...props} isRequest={false}/>
                </div>
              </div>) : null
          }
          <RequestResultDisplayingComponent {...props.requestResponse} />
        </IndividualStepContainer>
        <Divider/>

        <IndividualStepContainer run={props.initializeDatabase} title="Initialize Database">
          <SqlInput updateFn={props.updateInitializationScript} label="Insert Statement"
                    placeholder="Insert DB insert statement" name={insert.name} query={insert.query}/>
          <SuccessFailResultComponent {...insert.databaseInsertResponse}/>
        </IndividualStepContainer>
        <Divider/>

        <IndividualStepContainer run={props.assertDatabaseValues} title="Assert Database Values">
          <DatabaseInputComponent {...props}/>
        </IndividualStepContainer>
        <RaisedButton onClick={props.saveScenario} label="Save scenario" icon={<ContentSave/>} secondary={true}/>
        <RaisedButton onClick={props.runScenario} label="Run scenario" icon={<ContentSend/>} primary={true}/>
      </div>
  );
};

const ScenarioForm = connect(
    function mapStateToProps(state: State): Object {
      return {
        request: state.active.request,
        requestResponse: state.active.requestResponse,
        select: state.active.select,
        insert: state.active.insert,
        scenarioName: state.active.name
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
)(form);

export default ScenarioForm;