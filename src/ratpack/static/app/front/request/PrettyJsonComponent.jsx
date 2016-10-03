/* global PrettyJSON, $ */
/* eslint-disable no-new */

import React from 'react';
import ReactDOM from 'react-dom';

type Props = {
  validJson: React.PropTypes.bool.isRequired,
  payload: React.PropTypes.string
}

export default class PrettyJsonComponent extends React.Component {
  constructor(props: Props) {
    super(props);
    this.beautify = this.beautify.bind(this);
  }

  componentDidMount() {
    this.beautify();
  }

  componentDidUpdate() {
    this.beautify();
  }

  beautify() {
    const valid = this.props.validJson;
    const json = this.props.payload;
    const el = $(ReactDOM.findDOMNode(this));
    if (valid) {
      new PrettyJSON.view.Node({
        el: el,
        data: json
      });
    } else {
      el.empty().html('&nbsp;');
    }
  }

  render(): React.Element {
    return (
        <div/>
    );
  }
}