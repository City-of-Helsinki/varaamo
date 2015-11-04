import renderFullPage from './renderFullPage';

function handleRender(req, res) {
  const initialState = {};

  // Send the rendered page back to the client
  res.send(renderFullPage(initialState));
}

export default handleRender;
