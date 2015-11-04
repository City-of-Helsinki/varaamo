import renderFullPage from './renderFullPage';

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

  // Send the rendered page back to the client
  res.send(renderFullPage(initialState));
}

export default handleRender;
