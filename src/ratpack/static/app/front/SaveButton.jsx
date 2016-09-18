import React from 'react';

type Props = {
  saveAction: () => void
}
export default (props: Props): React.Element => {
  const {saveAction} = props;
  return (
      <button onClick={saveAction}>Save Scenario</button>
  );
};