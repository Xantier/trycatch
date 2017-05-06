import React from 'react';
import DatabaseAssertionInput from './DatabaseAssertionInput.jsx';
import DatabaseResultDisplayingComponent from './DatabaseResultDisplayingComponent.jsx';
import ExpandableCard from '../ExpandableCard.jsx';
import SimpleCard from '../SimpleCard.jsx';

export default (props: Props): React.Element => {
  const isFailure = props.select.databaseAssertionResponse && props.select.databaseAssertionResponse.result === 'failure';
  if (isFailure) {
    return (<SimpleCard>
      <DatabaseAssertionInput {...props}/>
      <DatabaseResultDisplayingComponent {...props.select.databaseAssertionResponse}/>
    </SimpleCard>);
  }
  return (<div>
    <ExpandableCard label="Display Query Results"
                    content={<DatabaseAssertionInput {...props}/>}
                    expandable={<DatabaseResultDisplayingComponent {...props.select.databaseAssertionResponse}/>}
                    canExpand={props.select.databaseAssertionResponse}
    />
  </div>);
};