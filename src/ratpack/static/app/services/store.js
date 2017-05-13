import reducer from '../services/reducer';
import {createStore, applyMiddleware, compose} from 'redux';
import createLogger from 'redux-logger';
import saga from 'redux-saga';
import sagas from '../services/sagas';

const sagaMiddleware = saga();

const logger = createLogger();
let envComposition;
if (process.env.NODE_ENV === 'development') {
  envComposition = compose(applyMiddleware(sagaMiddleware, logger),
      window.devToolsExtension ? window.devToolsExtension() : (f: Function) => f
  );
} else {
  envComposition = compose(applyMiddleware(sagaMiddleware));
}
export const store = createStore(reducer, envComposition);
sagaMiddleware.run(sagas);