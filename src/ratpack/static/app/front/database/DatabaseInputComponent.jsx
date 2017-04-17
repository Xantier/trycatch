import React from 'react';
import DatabaseAssertionInput from './DatabaseAssertionInput.jsx';
import DatabaseResultDisplayingComponent from './DatabaseResultDisplayingComponent.jsx';
import ExpandableCard from '../ExpandableCard.jsx';

export default (props: Props): React.Element => {
  return (<div>
    <ExpandableCard label="Display Query Results"
                    content={<DatabaseAssertionInput {...props}/>}
                    expandable={<DatabaseResultDisplayingComponent {...props.select.databaseAssertionResponse}/>}
                    canExpand={props.select.databaseAssertionResponse}
    />
  </div>);
};