import superagent from 'superagent';
import logger from '../logger';

export function postJson(url: string): () => void {
  return function (payload: string) {
    return superagent
        .post(url)
        .send(payload)
        .set('Accept', 'application/json');
  };
}