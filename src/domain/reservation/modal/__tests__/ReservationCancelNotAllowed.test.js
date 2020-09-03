import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl, globalDateMock } from '../../../../../app/utils/testUtils';
import ReservationCancelNotAllowed from '../ReservationCancelNotAllowed';
import resource from '../../../../common/data/fixtures/resource';

describe('domain/reservation/modal/ReservationCancelNotAllowed', () => {
  test('renders correctly', () => {
    globalDateMock();
    const mockResource = resource.build();
    const extraProps = {
      t: jest.fn(),
    };
    const props = {
      parentToggle: jest.fn(),
      resource: mockResource,
      toggleShow: true,
      billable: true,
    };

    const wrapper = shallowWithIntl(
      <ReservationCancelNotAllowed {...props} {...extraProps} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
