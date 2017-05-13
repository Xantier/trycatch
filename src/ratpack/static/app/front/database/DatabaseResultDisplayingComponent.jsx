import React from 'react';

import FontIcon from 'material-ui/FontIcon';
import {green500, red500} from 'material-ui/styles/colors';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

export default ({expectation, result, actual}: Props): React.Element => {
  const failure = result === 'failure';
  const actualTable = actual ? actual.split('\n').map((item: string, key: string): React.Element => {
    return (
        <TableRow key={key}>{item.split(',').map((i: string, k: string): React.Element =>
            <TableRowColumn key={k}>{i}</TableRowColumn>)}
        </TableRow>);
  }) : (<TableRow>
    <TableRowColumn >No Results</TableRowColumn>
  </TableRow>);
  return (
      <div>
        <div>
          <div>
            <h2>Response</h2>
          </div>
          {!failure ?
              (<div>
                <h4>
                  <FontIcon className="material-icons" color={green500}>done</FontIcon> Matches expectation
                </h4>
              </div>)
              : (<div>
                <h4>
                  <FontIcon className="material-icons" color={red500}>error</FontIcon> Does not match expectation
                </h4>
              </div>)
          }
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false} preScanRows={false}>
              {actualTable}
            </TableBody>
          </Table>
        </div>
      </div>
  );
};
