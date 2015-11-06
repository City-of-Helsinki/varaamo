import React from 'react';
import ReactDOMServer from 'react-dom/server';

import config from './config';
import Html from './Html';

function render(req, res) {
  const user = req.user;
  let initialState = {};
  if (user && user.id) {
    const token = user.token;
    delete user.token;
    initialState = {
      auth: { userId: user.id, token },
      data: {
        users: {
          [user.id]: user,
        },
      },
    };
  }

  const html = '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
    <Html
      appCssSrc={config.assetsSources.appCss}
      appScriptSrc={config.assetsSources.appJs}
      initialState={initialState}
      isProduction={config.isProduction}
    />
  );

  // Send the rendered page back to the client
  res.send(html);
}

export default render;
