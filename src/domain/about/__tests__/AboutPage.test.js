import React from 'react';
import toJson from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../app/utils/testUtils';
import AboutPage from '../AboutPage';

describe('pages/about/AboutPage', () => {
  test('render normally', () => {
    const wrapper = shallowWithIntl(<AboutPage />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
