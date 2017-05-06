import React from 'react';
import DatabaseAssertionInput from './DatabaseAssertionInput.jsx';
import DatabaseResultDisplayingComponent from './DatabaseResultDisplayingComponent.jsx';
import ExpandableCard from '../ExpandableCard.jsx';

export default (props: Props): React.Element => {
  const isFailure = props.select.databaseAssertionResponse && props.select.databaseAssertionResponse.result === 'failure';
  if (isFailure) {
    return (<div>
      <DatabaseAssertionInput {...props}/>
      <DatabaseResultDisplayingComponent {...props.select.databaseAssertionResponse}/>
    </div>);
  }
  return (<div>
    <ExpandableCard label="Display Query Results"
                    content={<DatabaseAssertionInput {...props}/>}
                    expandable={<DatabaseResultDisplayingComponent {...props.select.databaseAssertionResponse}/>}
                    canExpand={props.select.databaseAssertionResponse}
    />
  </div>);
};