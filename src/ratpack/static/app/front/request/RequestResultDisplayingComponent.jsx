/* global PrettyJSON, $ */
/* eslint-disable no-new */

import React from 'react';
import ReactDOM from 'react-dom';
import FontIcon from 'material-ui/FontIcon';
import {green500, red500} from 'material-ui/styles/colors';

type Actual = {
  body: string,
  responseCode: number
}

type Props = {
  result: string,
  expectation: string,
  actual: Actual
}

export default class RequestResultDisplayingComponent extends React.Component {
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
    let icon;
    if (this.props.actual) {
      icon = this.props.actual.responseCode !== -1 ?
        <FontIcon className="material-icons" color={green500}>done</FontIcon>
        : <FontIcon className="material-icons" color={red500}>error</FontIcon>;
    }
    const expectedJsx = this.props.expectation && this.props.expectation !== '' ? (<div>
      <h2>Expected</h2>
      <div ref="expectation"/>
    </div>) : null;
    return this.props.result ? (
      <div>
        {expectedJsx}
        <div>
          <h2>Actual</h2>
          {this.props.actual.responseCode === -1 ? 'Application Error, please see logs' : <div ref="actual"/>}
        </div>
        <span>{this.props.actual ? 'Response Code: ' + this.props.actual.responseCode : null}</span>
        <h4>Test Result</h4>
        <span>{icon}</span>
      </div>
    ) : <div/>;
  }
}