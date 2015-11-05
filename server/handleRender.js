import Html from './Html';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

function handleRender(req, res) {
  const user = req.user;
  let initialState = {};
  if (user && user.id) {
    initialState = {
      auth: { userId: user.id },
      data: {
        users: {
          [user.id]: user,
        },
      },
    };
  }

  const appScriptSrc = '/app.js';
  const html = '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
    <Html
      appScriptSrc={appScriptSrc}
      initialState={initialState}
    />
  );

  // Send the rendered page back to the client
  res.send(html);
}

export default handleRender;
