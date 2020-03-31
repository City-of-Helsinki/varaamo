import React from 'react';
import toJSON from 'enzyme-to-json';
import { shallow } from 'enzyme';
import snakeCaseKeys from 'snakecase-keys';

import ManageReservationsPincode from '../ManageReservationsPincode';
import reservation from '../../../../../common/data/fixtures/reservation';
import resource from '../../../../../common/data/fixtures/resource';

// This project handles API responses differently based on the method
// that is used for fetching. Data in the redux store is in camelCase,
// but data fetched through the apiClient is in snake_case. This
// component was previously used in a context where API data
// originated from the redux store, but now lives in a context where
// this data comes directly from the apiClient.

// To be able to use the same test tooling, we are transforming the
// camelCase mock objects into snake_case mock objects.
const makeSnakeCase = obj => snakeCaseKeys(obj);

describe('ManageReservationsPincode', () => {
  function getWrapper(props) {
    return shallow(
      <ManageReservationsPincode {...props} />,
    );
  }

  const pendingCodeResource = resource.attr('generateAccessCodes', false);

  test('renders correctly', () => {
    const wrapper = getWrapper({ reservation: makeSnakeCase(reservation.build()) });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('show Icon when accessCode pending', () => {
    const wrapper = getWrapper({
      reservation: reservation.build({ resource: makeSnakeCase(pendingCodeResource.build()) }),
    });
    expect(wrapper.debug()).toContain('img');
  });

  test('show **** when accessCode exist', () => {
    reservation.attr('accessCode', 1234);
    const wrapper = getWrapper({ reservation: makeSnakeCase(reservation.build()) });
    expect(wrapper.html()).toContain('****');
  });
});
