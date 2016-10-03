import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import saga from 'redux-saga';
import {Provider} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import reducer from './reducer';
import sagas from './sagas';
import ScenarioForm from './ScenarioForm.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
const sagaMiddleware = saga();
const store = createStore(
    reducer,
    compose(
        applyMiddleware(sagaMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : (f: Function) => f
    ));
sagaMiddleware.run(sagas);

ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider>
        <ScenarioForm />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('container')
);