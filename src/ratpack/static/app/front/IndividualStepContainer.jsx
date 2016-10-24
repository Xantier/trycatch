import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';

type Props = {
  children: React.Element[],
  run: () => void
}

export default ({children, run}: Props): React.Element => {
  return (
      <div>
        {children}
        <RaisedButton onClick={run} label="Test Individual Step" icon={<AvPlayArrow/>} primary={true}/>
      </div>
  );
};

