import superagent from 'superagent';

export function postJson(url: string): () => Promise {
  return function (payload: string): Promise{
    return superagent
        .post(url)
        .send(payload)
        .set('Accept', 'application/json');
  };
}