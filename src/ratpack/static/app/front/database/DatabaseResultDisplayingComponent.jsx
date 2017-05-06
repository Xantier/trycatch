import React from 'react';

import {resultStyle} from '../styles';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import SuccessFailResultComponent from '../SuccessFailResultComponent.jsx';

export default ({expectation, result, actual, message}: Props): React.Element => {
  if (result !== 'failure') {
    const expectedJsx = expectation !== '' ? (<div>
      <h2>Expected</h2>
    </div>) : null;
    const actualTable = actual.split('\n').map((item: string, key: string): React.Element => {
      return (
          <TableRow key={key}>{item.split(',').map((i: string, k: string): React.Element =>
              <TableRowColumn key={k}>{i}</TableRowColumn>)}
          </TableRow>);
    });
    return (
        <div>
          <div>
            {expectedJsx}
            <div>
              <h2>Actual</h2>
            </div>
            <Table selectable={false}>
              <TableBody displayRowCheckbox={false} preScanRows={false}>
                {actualTable}
              </TableBody>
            </Table>
            {
              expectation !== '' ?
                  (<div style={resultStyle(result)}>
                    <h4>Test Result</h4>
                    <span>{result}</span>
                  </div>) :
                  (<div>
                    <h4>No expectation defined</h4>
                  </div>)
            }
          </div>
        </div>
    );
  }
  return <SuccessFailResultComponent result={result} message={message}/>;
};
