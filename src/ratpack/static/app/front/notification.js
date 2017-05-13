import {store} from '../services/store';
import * as t from '../services/constants';

type Action = {
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any,
}

export default (message: string, isError: boolean): Action => {
  store.dispatch({type: t.ADD_NOTIFICATION, payload: message, isError: isError});
};

export const close = (): Action => {
  store.dispatch({type: t.CLOSE_NOTIFICATION});
};
