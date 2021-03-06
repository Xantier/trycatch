import {connect} from 'react-redux';
import {close} from './notification';
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
} from '../services/actions';
import {stepIcon} from '../services/helpers';
import React from 'react';
import SqlInput from './database/SqlInput.jsx';
import DatabaseInputComponent from './database/DatabaseInputComponent.jsx';
import SuccessFailResultComponent from './common/SuccessFailResultComponent.jsx';
import JsonComponent from './request/JsonComponent.jsx';
import RequestComponent from './request/RequestComponent.jsx';
import RequestResultDisplayingComponent from './request/RequestResultDisplayingComponent.jsx';
import IndividualStepContainer from './common/IndividualStepContainer.jsx';
import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import ContentSave from 'material-ui/svg-icons/content/save';
import ContentSend from 'material-ui/svg-icons/content/send';
import Snackbar from 'material-ui/Snackbar';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import {red300, green200} from 'material-ui/styles/colors';

import TextField from 'material-ui/TextField';
import type {SqlInputType, Request} from '../services/reducer';

import type {State} from '../services/reducer';
import SimpleCard from './common/SimpleCard';

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
  requestResponse: Object,
  notification: Object
}

const form = (props: Props): React.Element => {
  const {insert} = props;
  const httpAavatar = <Avatar icon={<FontIcon className="material-icons">{stepIcon('request')}</FontIcon>} size={40}/>;
  const selectAavatar = <Avatar icon={<FontIcon className="material-icons">{stepIcon('select')}</FontIcon>} size={40}/>;
  const insertAavatar = <Avatar icon={<FontIcon className="material-icons">{stepIcon('insert')}</FontIcon>} size={40}/>;
  return (
      <div>
        <Card>
          <Toolbar>
            <ToolbarTitle text="Test Scenario"/>
          </Toolbar>
          <CardText>
            <TextField hintText="Scenario Name" floatingLabelText="Enter name for the scenario"
                       value={props.scenarioName}
                       onChange={(e: Event) => {
                         props.updateName(e.target.value);
                       }}/>
          </CardText>
        </Card>
        <Divider/>

        <IndividualStepContainer run={props.initializeDatabase} title="Initialize Database" withActions={true} avatar={insertAavatar}>
          <SimpleCard>
            <SqlInput updateFn={props.updateInitializationScript} label="Insert Statement"
                      placeholder="Insert DB insert statement" name={insert.name} query={insert.query}/>
            <SuccessFailResultComponent {...insert.databaseInsertResponse}/>
          </SimpleCard>
        </IndividualStepContainer>

        <Divider/>
        <IndividualStepContainer run={props.postJson} title="Make HTTP Request" withActions={true} avatar={httpAavatar}>
          <RequestComponent {...props} {...props.request}/>
          {props.request && props.request.method !== 'GET' ?
              (<div>
                <h2>Payload</h2>
                <div>
                  <JsonComponent {...props} isRequest={true}/>
                </div>
              </div>) : null
          }
          <div>
            <h2>Expectation</h2>
            <div>
              <JsonComponent {...props}/>
            </div>
          </div>
          <RequestResultDisplayingComponent {...props.requestResponse} />
        </IndividualStepContainer>
        <Divider/>
        <IndividualStepContainer run={props.assertDatabaseValues} title="Assert Database Values" withActions={true} avatar={selectAavatar}>
          <DatabaseInputComponent {...props}/>
        </IndividualStepContainer>
        <RaisedButton onClick={props.saveScenario} label="Save scenario" icon={<ContentSave/>} secondary={true}/>
        <RaisedButton onClick={props.runScenario} label="Run scenario" icon={<ContentSend/>} primary={true}/>
        <Snackbar
            open={props.notification.open}
            message={props.notification.message}
            autoHideDuration={4000}
            action="OK"
            onActionTouchTap={close}
            onRequestClose={close}
            bodyStyle={{
              backgroundColor: props.notification.isError && props.notification.isError === true
                  ? red300 : green200
            }}
        />
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
        scenarioName: state.active.name,
        notification: state.notification
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