import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import {httpHeaders} from './constants.js';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

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
  const DELETE = 'header-delete';
  const headers = params
      .sort((a: Object, b: Object): number => a.id - b.id)
      .map((it: HeaderMap): React.Element => {
        return (
            <div key={it.id}>
              <AutoComplete
                  searchText={it.key} hintText="Key" dataSource={httpHeaders}
                  onNewRequest={(value: string) => {
                    updateRequest(KEY, value, it.id);
                  }}/>
              <AutoComplete
                  searchText={it.value} hintText="Value"
                  dataSource={httpHeaders}
                  onNewRequest={(value: string) => {
                    updateRequest(VALUE, value, it.id);
                  }}/>
              <IconButton tooltip="Delete extra header" onTouchTap={() => {
                updateRequest(DELETE, '', it.id);
              }}>
                <FontIcon className="material-icons">delete</FontIcon>
              </IconButton>
            </div>);
      });
  return (
      <div>
        <div>
          <SelectField
              style={{float: 'left', width: '18%', marginRight: '2%'}}
              value={method} floatingLabelText="HTTP Method"
              onChange={(_: Object, __: string, value: string) => {
                updateRequest('method', value);
              }}>
            <MenuItem value="GET" primaryText="GET"/>
            <MenuItem value="POST" primaryText="POST"/>
            <MenuItem value="PUT" primaryText="PUT"/>
            <MenuItem value="DELETE" primaryText="DELETE"/>
          </SelectField>
          <TextField
              style={{float: 'left', width: '80%'}}
              hintText="https://jsonplaceholder.typicode.com/posts/1"
              floatingLabelText="URL"
              value={url}
              onChange={(e: Event) => {
                updateRequest('url', e.target.value);
              }}/>
        </div>
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

