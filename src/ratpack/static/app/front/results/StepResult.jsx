/* eslint-disable react/no-multi-comp */

import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import {green500, red500} from 'material-ui/styles/colors';

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
const drawSelectStep = (values: string): string => {
  if (values && (Array.isArray(values) || typeof values === 'string')) {
    const split = typeof values === 'string' ? values.split('\n') : values;
    const actualTable = split.length ? split.map((item: string, key: string): React.Element => {
      return (
          <TableRow key={key}>{item.split(',').map((i: string, k: string): React.Element =>
              <TableRowColumn key={k}>{i}</TableRowColumn>)}
          </TableRow>);
    }) : (<TableRow>
      <TableRowColumn >No Results</TableRowColumn>
    </TableRow>);
    return (
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false} preScanRows={false}>
            {actualTable}
          </TableBody>
        </Table>);
  }
  return values;
};

export default ({result}: Props): React.Element => {
  const isSelectStep = result.stepIdentifier.substr(0, 6) === 'select';

  const response = result.response;
  const actual = result.success ? response : parseErroredContent(response);
  const icon = result.success ?
      <FontIcon className="material-icons" color={green500}>done</FontIcon>
      : <FontIcon className="material-icons" color={red500}>error</FontIcon>;
  const responseContent = actual.content ? actual.content : parseActualForDisplay(actual);
  return (
      <div>
        <List>
          <Subheader>{icon} {result.success ? 'Successful' : 'Failure'}</Subheader>
          {response.expected ?
              (<ListItem children={
                <div key="1">
                  <h4 style={styles}>EXPECTED</h4>
                  <div>{isSelectStep ? drawSelectStep(response.expected) : response.expected}<br/></div>
                </div>
              }
              />) : null}
          <ListItem children={
            <div key="2">
              <h4 style={styles}>RESPONSE</h4>
              <div>{isSelectStep ? drawSelectStep(responseContent) : responseContent}<br/></div>
            </div>
          }
          />
        </List>
      </div>
  );
};
