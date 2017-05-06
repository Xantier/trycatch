import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import saga from 'redux-saga';
import createLogger from 'redux-logger';
import {Provider} from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {brown100} from 'material-ui/styles/colors';

import reducer from './reducer';
import sagas from './sagas';
import ScenarioForm from './ScenarioForm.jsx';
import Menu from './Menu.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
const sagaMiddleware = saga();
const logger = createLogger();
const store = createStore(
  reducer,
  compose(
    applyMiddleware(sagaMiddleware, logger),
    window.devToolsExtension ? window.devToolsExtension() : (f: Function) => f
  ));
sagaMiddleware.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <div style={{'backgroundColor': brown100}}>
        <div>
          <Menu/>
        </div>
        <div>
          <ScenarioForm />
        </div>
      </div>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('container')
);