const isLoggedInSelector = state => Boolean(state.auth.userId && state.auth.token);

export default isLoggedInSelector;
