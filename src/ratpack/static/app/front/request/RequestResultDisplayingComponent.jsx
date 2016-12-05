/* global PrettyJSON, $ */
/* eslint-disable no-new */

import React from 'react';
import ReactDOM from 'react-dom';

type Actual = {
  body: string,
  responseCode: number
}

type Props = {
  result: string,
  expectation: string,
  actual: Actual
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
    function displayJson(elem: string, str: string) {
      const el = $(ReactDOM.findDOMNode(this.refs[elem]));
      try {
        const json = JSON.parse(str);
        new PrettyJSON.view.Node({
          el: el,
          data: json
        });
      } catch (_) {
        el.empty().html('&nbsp;');
      }
    }

    if (this.props.result) {
      displayJson.call(this, 'expectation', this.props.expectation);
      displayJson.call(this, 'actual', this.props.actual.body);
    }

  }

  render(): React.Element {
    const expectedJsx = this.props.expectation ? (<div>
      <h2>Expected</h2>
      <div ref="expectation"/>
    </div>) : null;
    return this.props.result ? (
        <div>
          {expectedJsx}
          <h2>Actual</h2>
          <div ref="actual"/>
          <span>{this.props.actual ? 'Response Code: ' + this.props.actual.responseCode : null}</span>
          <h4>Test Result</h4>
          <span>{this.props.result}</span>
        </div>
    ) : <div/>;
  }
}