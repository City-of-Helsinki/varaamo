import { compose } from 'redux';
import persistState from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';

const storage = compose(
  filter('intl.locale')
)(adapter(window.localStorage));

export default persistState(storage);
