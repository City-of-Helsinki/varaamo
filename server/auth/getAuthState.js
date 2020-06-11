function getAuthState(req) {
  const { user } = req;
  if (user && user.token) {
    return {
      auth: { userId: user.id, token: user.token },
    };
  }
  return {};
}

export default getAuthState;
