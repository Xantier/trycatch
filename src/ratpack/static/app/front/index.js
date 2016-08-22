import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Provider} from 'react-redux';
import reducer from './reducer';
import sagas from './sagas';
import TodoList from './TodoListContainer.jsx';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(sagas);
render(
    <Provider store={store}>
      <TodoList />
    </Provider>,
    document.getElementById('container')
);