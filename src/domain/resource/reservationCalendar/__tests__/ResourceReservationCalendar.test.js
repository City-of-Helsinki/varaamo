import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl, globalDateMock } from '../../../../../app/utils/testUtils';
import { UntranslatedResourceReservationCalendar as ResourceReservationCalendar } from '../ResourceReservationCalendar';
import resource from '../../../../common/data/fixtures/resource';

describe('ResourceReservationCalendar', () => {
  test('renders correctly', () => {
    globalDateMock();
    const props = {
      resource: resource.build(),
      date: '2019-08-15',
      onDateChange: jest.fn(),
      onReserve: jest.fn(),
      t: jest.fn(),
      locale: 'en',
    };

    const wrapper = shallowWithIntl(
      <ResourceReservationCalendar {...props} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
