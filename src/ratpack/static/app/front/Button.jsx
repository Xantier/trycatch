import React from 'react';

type Props = {
  action: () => void,
  text: string
}
export default (props: Props): React.Element => {
  const {action, text} = props;
  return (
      <button onClick={action}>{text}</button>
  );
};