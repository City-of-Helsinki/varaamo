import React from 'react';
import Immutable from 'seamless-immutable';
import { Link } from 'react-router-dom';
import snakeCaseKeys from 'snakecase-keys';

import InfoLabel from '../../../../../src/common/label/InfoLabel';
import TimeRange from '../../../../shared/time-range/TimeRange';
import Image from '../../../../utils/fixtures/Image';
import Reservation from '../../../../utils/fixtures/Reservation';
import Resource from '../../../../utils/fixtures/Resource';
import Unit from '../../../../utils/fixtures/Unit';
import ReservationControls from '../../../../shared/reservation-controls/ReservationControlsContainer';
import { getResourcePageUrl } from '../../../../utils/resourceUtils';
import { shallowWithIntl } from '../../../../utils/testUtils';
import ReservationListItem from '../ReservationListItem';

const makeTranslationObject = (value) => ({
  fi: value,
  en: value,
  sv: value,
});

const injectTranslations = (obj, fields) => {
  const nextObj = { ...obj };

  fields.forEach((field) => {
    const value = nextObj[field];

    nextObj[field] = makeTranslationObject(value);
  });

  return nextObj;
};

// This project handles API responses differently based on the method
// that is used for fetching. Data in the redux store is in camelCase,
// but data fetched through the apiClient is in snake_case. This
// component was previously used in a context where API data
// originated from the redux store, but now lives in a context where
// this data comes directly from the apiClient.

// To be able to use the same test tooling, we are transforming the
// camelCase mock objects into snake_case mock objects.
const makeReservation = (...args) => snakeCaseKeys(Reservation.build(...args));
const makeResource = (...args) =>
  snakeCaseKeys(injectTranslations(Resource.build(...args), ['name']));
const makeImage = (...args) =>
  snakeCaseKeys(injectTranslations(Image.build(...args), ['caption']));
const makeUnit = (...args) =>
  snakeCaseKeys(injectTranslations(Unit.build(...args), ['name']));

describe('pages/user-reservations/reservation-list/ReservationListItem', () => {
  const unit = Immutable(makeUnit());
  const resource = Immutable(
    makeResource({
      unit,
      images: [makeImage()],
      type: { name: 'test_type' },
    })
  );
  const props = {
    isAdmin: false,
    isStaff: false,
    reservation: Immutable(makeReservation({ resource })),
  };

  let component;

  beforeAll(() => {
    component = shallowWithIntl(<ReservationListItem {...props} />);
  });

  describe('rendering', () => {
    test('renders a li element', () => {
      expect(component.is('li')).toBe(true);
    });

    test('displays an image with correct props', () => {
      const image = component.find('.resourceImg');

      expect(image).toHaveLength(1);
      expect(image.props().alt).toBe(resource.images[0].caption.fi);
      expect(image.props().src).toBe(`${resource.images[0].url}?dim=700x420`);
    });

    test('contains two links to resource page with correct props', () => {
      const expectedUrl = getResourcePageUrl(resource);
      const links = component.find(Link);

      expect(links.length).toBe(2);
      // image link
      expect(links.at(0).prop('aria-hidden')).toBe('true');
      expect(links.at(0).prop('tabIndex')).toBe('-1');
      expect(links.at(0).prop('to')).toBe(expectedUrl);
      // header/name link
      expect(links.at(1).prop('to')).toBe(expectedUrl);
    });

    test('displays the name of the resource', () => {
      const expected = props.reservation.resource.name.fi;

      expect(component.find('h4').text()).toContain(expected);
    });

    test('displays the name of the given unit in props', () => {
      const expected = props.reservation.resource.unit.name.fi;

      expect(component.find('.unit-name').text()).toContain(expected);
    });

    test('contains TimeRange component with correct props', () => {
      const timeRange = component.find(TimeRange);
      expect(timeRange).toHaveLength(1);
      expect(timeRange.prop('begin')).toBe(props.reservation.begin);
      expect(timeRange.prop('end')).toBe(props.reservation.end);
    });

    test('renders InfoLabel component', () => {
      const infoLabel = component.find(InfoLabel);
      expect(infoLabel.length).toBe(1);
    });

    test('renders ReservationControls component', () => {
      const reservationControls = component.find(ReservationControls);
      expect(reservationControls).toHaveLength(1);
    });

    test('passes correct props to ReservationControls component', () => {
      const actualProps = component.find(ReservationControls).props();

      expect(actualProps.isAdmin).toBe(false);
      expect(actualProps.reservation).toBe(props.reservation);
      expect(actualProps.resource).toStrictEqual(resource);
    });
  });
});
