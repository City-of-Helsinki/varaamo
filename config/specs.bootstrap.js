import 'babel-polyfill';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({ adapter: new Adapter(), disableLifecycleMethods: true });

/* eslint-disable no-console */
console.warning = (...args) => { throw Error(`console.warning: ${args.join(' ')}`); };
console.error = (...args) => { throw Error(`console.error: ${args.join(' ')}`); };
/* eslint-enable */

const testsContext = require.context('../app', true, /spec.js$/);
testsContext.keys().forEach(testsContext);
