import React from 'react';

import IconButton from 'material-ui/IconButton';
import PlayCircleFilled from 'material-ui/svg-icons/av/play-circle-filled';

type Props = {
  name: string,
  action: () => void
}

export default ({name, action}: Props): React.Element => (
  <IconButton
    touch={true}
    tooltip="Run Scenario"
    tooltipPosition="bottom-left">
    <PlayCircleFilled onTouchTap={() => {
      action(name);
    }}/>
  </IconButton>
);