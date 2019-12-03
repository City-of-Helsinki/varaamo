import React from 'react';
import toJson from 'enzyme-to-json';

import CalendarLegend from '../CalendarLegend';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';

describe('CalendarLegend', () => {
  const getWrapper = () => shallowWithIntl(<CalendarLegend />);

  describe('Legend', () => {
    test('render normally', () => {
      const wrapper = getWrapper();

      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
