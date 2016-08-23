const uid = (): String => Math.random().toString(34).slice(2);

type Action = {
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any,
}

export function addTodo(text: String): Action {
  return {
    type: 'ADD_TODO',
    payload: {
      id: uid(),
      isDone: false,
      text: text
    }
  };
}

export function initializeDatabase(query: String): Action {
  return {
    type: 'INITIALIZE_DATABASE',
    payload: {
      query: query
    }
  };
}

export function postJson(id: Number): Action {
  return {
    type: 'POST_JSON',
    payload: id
  };
}

