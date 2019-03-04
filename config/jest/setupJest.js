import '@babel/polyfill';

// Enzyme config
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4';

// fetch() polyfill for making API calls.
require('isomorphic-fetch');

configure({ adapter: new Adapter(), disableLifecycleMethods: true });

// mock window, jsdom intergrated with Jest
window.scrollTo = () => {};
global.before = beforeAll;
global.after = afterAll;
