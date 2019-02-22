import '@babel/polyfill';

// Enzyme config
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// fetch() polyfill for making API calls.
require('isomorphic-fetch')

configure({ adapter: new Adapter() });

// mock window, jsdom intergrated with Jest
window.scrollTo = () => {};

