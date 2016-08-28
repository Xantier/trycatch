import superagent from 'superagent';
import logger from '../logger';

export function postJson(url: string): () => void {
  return function (payload: string) {
    superagent
      .post(url)
      .send({json: payload})
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err || !res.ok) {
          logger.warn('Oh no! error');
        } else {
          logger.info('yay got ' + JSON.stringify(res.body));
        }
      });
  };
}