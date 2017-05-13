import React from 'react';

import {Card, CardText, CardTitle} from 'material-ui/Card';
import {red500, green500} from 'material-ui/styles/colors';

export default ({result, actual}: Props): React.Element => {
  return (
      <div>
        {
          result === 'success' ?
              (<Card>
                <CardTitle title="Completed Successfully" titleColor={green500}/>
                <CardText>
                  <div>{actual}</div>
                </CardText>
              </Card>) : (<Card>
            <CardTitle title="Failed to complete step" titleColor={red500}/>
            <CardText>
              <div>{actual}</div>
            </CardText>
          </Card>)
        }
      </div>
  );
};
