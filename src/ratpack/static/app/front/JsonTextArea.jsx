/* global PrettyJSON, $ */
/* eslint-disable no-new */
import React from 'react';

export default (): React.Element => {
  return (
      <div>
        <input type="textarea" className="jsonarea" placeholder="Insert Json" onClick={() => {
          const obj = {
            name: 'John Doe',
            age: 20,
            children: [{name: 'Jack', age: 5}, {name: 'Ann', age: 8}],
            wife: {name: 'Jane Doe', age: 28}
          };

          new PrettyJSON.view.Node({
            el: $('#jsonarea'),
            data: obj
          });
        }}/>
        <div id="jsonarea">&nbsp;</div>
      </div>
  );
};

