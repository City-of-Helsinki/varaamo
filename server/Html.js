import React, { Component, PropTypes } from 'react';
import serialize from 'serialize-javascript';

class Html extends Component {
  getInitialStateHtml(initialState) {
    return `window.__INITIAL_STATE__ = ${serialize(initialState)};`;
  }

  render() {
    const { appScriptSrc, initialState } = this.props;
    const initialStateHtml = this.getInitialStateHtml(initialState);

    return (
      <html lang="fi">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <title>Respa</title>
        </head>
        <body>
          <div id="root" />
          <script dangerouslySetInnerHTML={{ __html: initialStateHtml }} />
          <script src={appScriptSrc} />
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  appScriptSrc: PropTypes.string.isRequired,
  initialState: PropTypes.object.isRequired,
};

export default Html;
