import React from 'react';

type Props = {
  children: React.Element[],
  run: () => void
}

export default ({children, run}: Props): React.Element => {
  return (
      <div>
        {children}
        <button onClick={run}>Test Individual Step</button>
      </div>
  );
};

