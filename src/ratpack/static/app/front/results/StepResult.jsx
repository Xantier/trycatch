/* eslint-disable react/no-multi-comp */

import React from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import {pink600, red300, teal300, green500, red500} from 'material-ui/styles/colors';

const styles = {
  headline: {
    fontSize: 13,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 100
  }
};
const parseErroredContent = (resp: Object): string => {
  if (Object.isObject(resp.actual)) {
    return resp.actual;
  }
  try {
    return JSON.parse(resp.actual);
  } catch (e) {
    return resp.actual;
  }
};

const parseActualForDisplay = (actual: any): string => {
  if (actual instanceof Array && actual[0].message) {
    return actual[0].message;
  } else if (actual instanceof Array) {
    return actual;
  } else if (actual.message) {
    return actual.message;
  }
  return actual;
};

export default ({result}: Props): React.Element => {
  const response = result.response;
  const actual = result.success ? response : parseErroredContent(response);
  const icon = result.success ?
      <FontIcon className="material-icons" color={green500}>done</FontIcon>
      : <FontIcon className="material-icons" color={red500}>error</FontIcon>;
  return (
      <div>
        <List>
          <Subheader>{icon} {result.success ? 'Successful' : 'Failure'}</Subheader>
          {response.expected ?
              (<ListItem children={
                <div key="1">
                  <h4 style={styles}>EXPECTED</h4>
                  <div>{response.expected}<br/></div>
                </div>
              }
              />) : null}
          <ListItem children={
            <div key="2">
              <h4 style={styles}>RESPONSE</h4>
              <div>{actual.content ? actual.content : parseActualForDisplay(actual)}<br/></div>
            </div>
          }
          />
        </List>
      </div>
  );
};
