import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {brown100} from 'material-ui/styles/colors';

import ScenarioForm from './ScenarioForm.jsx';
import ScenarioResults from './results/ScenarioResults.jsx';
import Menu from './Menu.jsx';
import {store} from '../services/store';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div style={{'backgroundColor': brown100}}>

          <div>
            <Menu/>
          </div>

          <div id="pagewrap">
            <section id="middle">
              <div>
                <ScenarioForm />
              </div>
            </section>
            <section id="right">
              <div>
                <ScenarioResults />
              </div>
            </section>
          </div>

        </div>
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('container')
);