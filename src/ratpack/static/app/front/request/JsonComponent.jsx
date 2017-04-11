import React from 'react';
import JsonTextArea from './JsonTextArea.jsx';
import PrettyJsonComponent from './PrettyJsonComponent.jsx';
import ExpandableCard from '../ExpandableCard.jsx';

export default (props: Props): React.Element => {
  if (props.isRequest) {
    return (<div>
      <ExpandableCard label="Display Pretty JSON"
                      content={<JsonTextArea {...props} jsonString={props.request.payloadJson}
                                             label="Insert JSON payload"
                                             contentType="payload" {...props.request} />}
                      expandable={<PrettyJsonComponent payload={props.request.payload}
                                                       validJson={props.request.validJson.payload}/>}
      />
    </div>);
  }
  return (<div>
    <ExpandableCard label="Display Pretty JSON"
                    content={<JsonTextArea {...props} jsonString={props.request.expectationJson}
                                           label="Insert expected JSON"
                                           contentType="expectation" {...props.request} />}
                    expandable={<PrettyJsonComponent payload={props.request.expectation}
                                                     validJson={props.request.validJson.payload}/>}
    />
  </div>);
};