import '@babel/polyfill';
import 'moment-timezone';
import moment from 'moment';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

// fetch() polyfill for making API calls.
require('isomorphic-fetch');

configure({ adapter: new Adapter(), disableLifecycleMethods: true });

// Adding global locale for all unit test
moment.tz.setDefault('Europe/Helsinki');
moment.locale('fi');

// mock window, jsdom intergrated with Jest
window.scrollTo = () => {};
