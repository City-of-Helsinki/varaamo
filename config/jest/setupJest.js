
// Enzyme config
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


// Global fetch for redux-api-middleware
global.fetch = require('jest-fetch-mock');

configure({ adapter: new Adapter() });

// mock window, jsdom intergrated with Jest
window.scrollTo = () => {};
window.matchMedia = () => ({ foo: '' });
