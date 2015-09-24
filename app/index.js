import 'babel-core/polyfill';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {ReduxRouter} from 'redux-react-router';

import configureStore from 'store/configureStore';

import 'assets/styles/app.less';

const store = configureStore();

render(
  <div>
    <Provider store={store}>
      <ReduxRouter />
    </Provider>
  </div>,
  document.getElementById('root')
);

if (__DEVTOOLS__) {
  require('./createDevToolsWindow')(store);
}
