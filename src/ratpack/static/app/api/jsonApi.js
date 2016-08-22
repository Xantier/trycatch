import superagent from 'superagent';

export function postJson(payload) {
  superagent
      .post('/api/json')
      .send({json: payload})
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err || !res.ok) {
          console.log('Oh no! error');
        } else {
          console.log('yay got ' + JSON.stringify(res.body));
        }
      });
}