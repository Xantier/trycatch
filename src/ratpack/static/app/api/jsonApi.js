import superagent from 'superagent';

export function postJson(url: string): () => Promise {
  return function (payload: string): Promise {
    return superagent
        .post(url)
        .send(payload)
        .set('Accept', 'application/json');
  };
}

export function getFromUrl(url: string): () => Promise {
  return function (): Promise {
    return superagent
        .get(url)
        .set('Accept', 'application/json');
  };
}