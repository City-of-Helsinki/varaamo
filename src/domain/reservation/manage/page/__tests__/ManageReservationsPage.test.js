import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../../app/utils/testUtils';
import { UnwrappedManageReservationsPage } from '../ManageReservationsPage';
import resourceCreator from '../../../../../common/data/fixtures/resource';
import reservationCreator from '../../../../../common/data/fixtures/reservation';
import { RESERVATION_SHOWONLY_FILTERS } from '../../../constants';
import { RESERVATION_STATE } from '../../../../../constants/ReservationState';

describe('ManageReservationsPage', () => {
  const defaultProps = {
    location: { search: '' }
  };
  const wrapper = props => shallowWithIntl(
    <UnwrappedManageReservationsPage {...defaultProps} {...props} />
  );

  test('renders correctly', () => {
    const page = wrapper();
    expect(toJSON(page)).toMatchSnapshot();
  });

  describe('Reservation show_only filters', () => {
    const unFavResource = resourceCreator.build({ id: 'unfav' });
    const favResource = resourceCreator.build({ id: 'fav' });

    const unFavReservation = reservationCreator.build({
      resource: unFavResource,
      user_permissions: { can_modify: false },
      state: RESERVATION_STATE.REQUESTED
    });

    const favReservation = reservationCreator.build({
      resource: favResource,
      user_permissions: { can_modify: true },
      state: RESERVATION_STATE.CANCELLED
    });

    const canModifyFav = reservationCreator.build({
      resource: favResource,
      user_permissions: { can_modify: true },
      state: RESERVATION_STATE.REQUESTED
    });

    const mockReservations = [
      unFavReservation,
      favReservation,
      canModifyFav
    ];

    const page = wrapper({ userFavoriteResources: ['fav'] });

    beforeAll(() => {
      page.setState({ reservations: mockReservations });
      page.update();
    });

    test('return unfiltered reservations by default if no selected filter', () => {
      const filtered = page.instance().getFilteredReservations([]);
      const empty = page.instance().getFilteredReservations();

      expect(filtered).toEqual(mockReservations);
      expect(empty).toEqual(mockReservations);
    });

    test('return unfiltered reservations by default if arguments is not supported', () => {
      const filtered = page.instance().getFilteredReservations('foo');

      expect(filtered).toEqual(mockReservations);
    });

    test('return favorite reservations if show_only: favorite selected', () => {
      const filtered = page.instance().getFilteredReservations([RESERVATION_SHOWONLY_FILTERS.FAVORITE]);

      expect(filtered).toEqual([favReservation, canModifyFav]);
    });

    test('return can_modify reservations if show_only: can_modify selected', () => {
      const filtered = page.instance().getFilteredReservations([RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY]);

      expect(filtered).toEqual([canModifyFav]);
    });
  });
});
