import React from 'react';

type Props = {
  postJson: () => void,
  validJson: boolean
}

export default ({updateJson, validJson}: Props): React.Element => {
  return (
      <div>
        <textarea rows="14" cols="250" className="jsonarea" placeholder="Insert Json" onChange={(e: Event) => {
          updateJson(e.target.value);
        }}/>
        <div>{!validJson ? <span style={{color: '#B03053'}}>Incorrect JSON</span> : <span>&nbsp;</span>}</div>
      </div>
  );
};

