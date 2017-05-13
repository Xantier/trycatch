/* global PrettyJSON, $ */
/* eslint-disable no-new */

import React from 'react';
import ReactDOM from 'react-dom';
import SuccessFailResultComponent from '../common/SuccessFailResultComponent.jsx';
import FontIcon from 'material-ui/FontIcon';
import {green500, red500} from 'material-ui/styles/colors';
import {Card, CardText, CardTitle} from 'material-ui/Card';
import {red300, teal300} from 'material-ui/styles/colors';

type Actual = {
  body: string,
  responseCode: number,
  response: string,
  errormessage?: string
}

type Props = {
  result: string,
  message: string,
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

  static constructErrorMsg(actual: Actual, props: Props): React.Component {
    if (actual) {
      return (<Card>
        <CardTitle title={`Response Code: ${actual.responseCode}`} titleColor={red300}/>
        <CardText>
          <div>{actual.errormessage}</div>
        </CardText>
      </Card>);
    }
    return (<Card>
      <CardText>
        <div>{props.message}</div>
      </CardText>
    </Card>);
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
      if (this.props.actual) {
        displayJson.call(this, 'actual', this.props.actual.body);
      }
    }
  }

  render(): React.Element {
    if (this.props.result === 'failure') {
      return <SuccessFailResultComponent {...this.props} actual={RequestResultDisplayingComponent.constructErrorMsg(this.props.actual, this.props)}/>;
    }
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
            <Card>
              <CardTitle title="Actual" titleColor={this.props.actual.responseCode === -1 ? red300 : teal300} children={icon}/>
              <CardText>
                <div>{this.props.actual ? 'Response Code: ' + this.props.actual.responseCode : null}</div>
              </CardText>
            </Card>
          </div>
        </div>) : null;
  }
}