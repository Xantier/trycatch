import superagent from 'superagent';
import logger from '../logger';

export function postJson(url: string): () => void {
  return function (payload: string) {
    superagent
        .post(url)
        .send({json: payload})
        .set('Accept', 'application/json')
        .end((err: Object, res: Object) => {
          if (err || !res.ok) {
            logger.warn('Oh no! error');
            logger.warn(err);
          } else {
            logger.info('yay got ' + JSON.stringify(res.body));
          }
        });
  };
}