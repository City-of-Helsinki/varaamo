import React from 'react';
import ReactDOMServer from 'react-dom/server';

import config from './config';
import Html from './Html';

function render(req, res) {
  const user = req.user;
  let initialState = {};
  if (user && user.id && user.token) {
    initialState = {
      auth: { userId: user.id, token: user.token },
      data: {
        users: {
          [user.id]: user,
        },
      },
    };
  }

  const htmlContent = ReactDOMServer.renderToStaticMarkup(
    <Html
      appCssSrc={config.assetsSources.appCss}
      appScriptSrc={config.assetsSources.appJs}
      initialState={initialState}
      isProduction={config.isProduction}
      piwikSiteId={config.piwikSiteId}
    />,
  );
  const html = `<!DOCTYPE html>${htmlContent}`;

  // Send the rendered page back to the client
  res.send(html);
}

export default render;
