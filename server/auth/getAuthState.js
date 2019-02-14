function getAuthState(req) {
  const user = req.user;
  if (user && user.token) {
    return {
      auth: { userId: user.id, token: user.token }
    };
  }
  return {};
}

export default getAuthState;
