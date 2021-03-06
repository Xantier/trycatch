import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ActionLineStyle from 'material-ui/svg-icons/action/line-style';
import {pd as prettyData} from 'pretty-data';

type Props = {
  updateFn: () => void,
  query: string,
  placeholder: string,
  label: string
};

export default (props: Props): React.Element => {
  const {updateFn, query, placeholder, label} = props;
  const update = (text: String, action: () => void) => {
    action(text);
  };
  const beautify = (action: () => void) => {
    action(prettyData.sql(query));
  };
  return (<div>
    <RaisedButton label="Beautify SQL" onClick={() => beautify(updateFn)} secondary={true} icon={<ActionLineStyle/>}/>
    <TextField
        hintText={placeholder}
        floatingLabelText={label}
        rows={10}
        rowsMax={40}
        multiLine={true}
        fullWidth={true}
        value={query}
        onChange={(e: Event) => {
          update(e.target.value, updateFn);
        }}/>
  </div>);
};