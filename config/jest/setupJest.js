// Global fetch for redux-api-middleware
global.fetch = require('jest-fetch-mock')

// Enzyme config
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });