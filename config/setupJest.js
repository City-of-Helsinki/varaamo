// Global fetch for redux-api-middleware
global.fetch = require('jest-fetch-mock')

// Mocha

global.context = describe;
global.before = beforeAll;
global.after = afterEach;

// Enzyme config
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });