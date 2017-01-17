import React from 'react';
import TextField from 'material-ui/TextField';

type Props = {
  updateJson: (value: string, contentType: string) => void,
  validJson: boolean,
  label: string,
  contentType: string,
  jsonString: Object
}

export default ({updateJson, validJson, label, contentType, jsonString}: Props): React.Element => {
  return (
    <div>
      <TextField
        hintText={label}
        floatingLabelText={label}
        fullWidth={true}
        value={jsonString}
        onChange={(e: Event) => {
          updateJson(e.target.value, contentType);
        }}
        multiLine={true}
        rows={6}/>
      <div>{!validJson[contentType] ? <span style={{color: '#B03053'}}>Incorrect JSON</span> :
        <span>&nbsp;</span>}</div>
    </div>
  );
};

