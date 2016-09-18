import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import saga from 'redux-saga';
import {Provider} from 'react-redux';
import reducer from './reducer';
import sagas from './sagas';
import ScenarioForm from './ScenarioForm.jsx';

const sagaMiddleware = saga();
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(sagas);

ReactDOM.render(
    <Provider store={store}>
      <ScenarioForm />
    </Provider>,
    document.getElementById('container')
);