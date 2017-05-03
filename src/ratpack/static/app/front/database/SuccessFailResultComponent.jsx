import React from 'react';

import {resultStyle} from '../styles';

export default ({result}: Props): React.Element => {
  console.log(result);
  return (
      <div>
        {
          result ?
              (<div style={resultStyle(result)}>
                <h4>Test Result</h4>
                <span>{result.message}</span>
              </div>) :
              (null)
        }
      </div>
  );
};
