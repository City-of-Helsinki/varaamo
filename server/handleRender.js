import renderFullPage from './renderFullPage';

function handleRender(req, res) {
  const user = req.user;
  const initialState = { auth: { user } };

  // Send the rendered page back to the client
  res.send(renderFullPage(initialState));
}

export default handleRender;
