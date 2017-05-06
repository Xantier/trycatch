import React from 'react';

import {Card, CardText, CardTitle} from 'material-ui/Card';
import {pink600, red300, teal300} from 'material-ui/styles/colors';

export default ({result, message}: Props): React.Element => {
  return (
      <div>
        {
          result ?
              (<Card>
                <CardTitle title="Failed to complete step" titleColor={red300}/>
                <CardText>
                  <div>{message}</div>
                </CardText>
              </Card>) :
              (null)
        }
      </div>
  );
};
