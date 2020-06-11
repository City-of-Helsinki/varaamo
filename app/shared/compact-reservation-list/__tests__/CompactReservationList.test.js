import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from '../../../utils/fixtures/Reservation';
import Resource from '../../../utils/fixtures/Resource';
import TimeRange from '../../time-range/TimeRange';
import CompactReservationList from '../CompactReservationList';

describe('shared/compact-reservation-list/CompactReservationList', () => {
  const resource = Resource.build();
  const defaultProps = {
    reservations: Immutable([
      Reservation.build({ resource: resource.id }),
      Reservation.build({ resource: 'unfetched-resource' }),
    ]),
    resources: Immutable({
      [resource.id]: resource,
    }),
    onRemoveClick: () => {},
  };

  function getWrapper(extraProps) {
    return shallow(
      <CompactReservationList {...defaultProps} {...extraProps} />
    );
  }

  const wrapper = getWrapper();

  test('renders a list for selected reservations', () => {
    const ul = wrapper.find('ul');
    expect(ul.length).toBe(1);
  });

  test('renders a list element for each selected reservation', () => {
    const li = wrapper.find('li');
    expect(li.length).toBe(defaultProps.reservations.length);
  });

  test('displays a TimeRange for each selected reservation', () => {
    const timeRange = wrapper.find(TimeRange);
    expect(timeRange.length).toBe(defaultProps.reservations.length);
  });

  describe('rendering resource name', () => {
    test('renders resource name if correct resource is given', () => {
      const li = wrapper.find('li').at(0);
      expect(li.text()).toContain(resource.name);
    });

    test('does not render resource name if correct resource is not given', () => {
      const li = getWrapper({ resources: undefined }).find('li').at(0);
      expect(li.text()).not.toContain(resource.name);
    });
  });

  describe('subtitle', () => {
    test('is rendered if subtitle is specified', () => {
      const reservations = [Reservation.build({ foo: 'bar' })];
      const props = { reservations, subtitle: 'foo' };
      const subtitle = getWrapper(props).find(
        '.compact-reservation-list-subtitle'
      );
      expect(subtitle).toHaveLength(1);
      expect(subtitle.text()).toBe(reservations[0].foo);
    });

    test('is not rendered if subtitle is not specified', () => {
      expect(
        getWrapper().find('.compact-reservation-list-subtitle')
      ).toHaveLength(0);
    });
  });

  describe('remove button', () => {
    test('is rendered if reservation is in removableReservations', () => {
      const reservations = [Reservation.build({ foo: 'bar' })];
      const removableReservations = [Reservation.build(), Reservation.build()];
      const props = { reservations, removableReservations };
      const buttons = getWrapper(props).find({ glyph: 'remove-circle' });
      expect(buttons).toHaveLength(2);
    });

    test('passes onRemoveClick func to onClick prop', () => {
      const onRemoveClick = simple.mock();
      const removableReservations = [Reservation.build()];
      const props = { onRemoveClick, removableReservations };
      const button = getWrapper(props).find({ glyph: 'remove-circle' });
      expect(onRemoveClick.callCount).toBe(0);
      button.prop('onClick')();
      expect(onRemoveClick.lastCall.args).toEqual([
        removableReservations[0].begin,
      ]);
    });
  });
});
