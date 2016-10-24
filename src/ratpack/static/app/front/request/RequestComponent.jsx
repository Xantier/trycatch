import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import {httpHeaders} from './constants.js';

type HeaderMap = {
  key: string,
  value: string,
  id: number
};
type Props = {
  updateRequest: (value: string) => void,
  method: string,
  url: string,
  params: HeaderMap[]
}

const actionButtonStyle = {
  marginRight: 20
};

export default ({updateRequest, method, url, params}: Props): React.Element => {
  const KEY = 'header-key';
  const VALUE = 'header-value';
  const headers = params
      .sort((a: Object, b: Object): number => a.id - b.id)
      .map((it: HeaderMap): React.Element => {
        return (
            <div key={it.id}>
              <AutoComplete
                  value={it.key}
                  hintText="Key" dataSource={httpHeaders}
                  onUpdateInput={(value: string) => {
                    updateRequest(KEY, value, it.id);
                  }}
                  onNewRequest={(value: string) => {
                    updateRequest(KEY, value, it.id);
                  }}/>
              <AutoComplete
                  value={it.value}
                  hintText="Value"
                  dataSource={httpHeaders}
                  onUpdateInput={(value: string) => {
                    updateRequest(VALUE, value, it.id);
                  }}
                  onNewRequest={(value: string) => {
                    updateRequest(VALUE, value, it.id);
                  }}/>
            </div>);
      });
  return (
      <div>
        <SelectField value={method} floatingLabelFixed={true} floatingLabelText="HTTP Method"
                     onChange={(_: Object, __: string, value: string) => {
                       updateRequest('method', value);
                     }}>
          <MenuItem value="GET" primaryText="GET"/>
          <MenuItem value="POST" primaryText="POST"/>
          <MenuItem value="PUT" primaryText="PUT"/>
          <MenuItem value="DELETE" primaryText="DELETE"/>
        </SelectField>

        <TextField
            hintText="http://www.jsonapi.com/get"
            floatingLabelText="URL"
            value={url}
            onChange={(e: Event) => {
              updateRequest('url', e.target.value);
            }}/>
        <Divider />
        <Subheader>Additional headers</Subheader>
        {headers}
        <FloatingActionButton mini={true} style={actionButtonStyle}
          onClick={() => {
            updateRequest('header-add');
          }}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
  );
};

