import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import { UntranslatedDateFilter as DateFilter } from '../DateFilter';
import { globalDateMock } from '../../../../../../app/utils/testUtils';

describe('DateFilter', () => {
  test('render normally', () => {
    const props = {
      label: 'foo',
      locale: 'en',
      onChange: jest.fn(),
      date: new Date(2017, 11, 10),
      t: jest.fn(),
    };

    globalDateMock();
    const wrapper = shallow(
      <DateFilter {...props} />,
    );


    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
