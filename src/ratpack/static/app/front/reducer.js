import {List, Map} from 'immutable';

export type State = Array;

const init = List([]);

export default function reducer(todos = init, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return todos.push(Map(action.payload));
    case 'TOGGLE_TODO':
      return todos.map(t => {
        if (t.get('id') === action.payload) {
          return t.update('isDone', isDone => !isDone);
        }
        return t;
      });
    default:
      return todos;
  }
}

