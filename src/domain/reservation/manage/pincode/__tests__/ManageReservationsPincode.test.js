import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';

import ManageReservationsPincode from '../ManageReservationsPincode';
import reservation from '../../../../../common/data/fixtures/reservation';
import resource from '../../../../../common/data/fixtures/resource';

describe('ManageReservationsPincode', () => {
  function getWrapper(props) {
    return shallow(
      <ManageReservationsPincode {...props} />
    );
  }

  const pendingCodeResource = resource.attr('generateAccessCodes', false);

  test('renders correctly', () => {
    const wrapper = getWrapper({ reservation: reservation.build() });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('show Icon when accessCode pending', () => {
    const wrapper = getWrapper({
      reservation: reservation.build({ resource: pendingCodeResource.build() })
    });
    expect(wrapper.debug()).toContain('img');
  });

  test('show **** when accessCode exist', () => {
    reservation.attr('accessCode', 1234);
    const wrapper = getWrapper({ reservation: reservation.build() });
    expect(wrapper.html()).toContain('****');
  });
});
