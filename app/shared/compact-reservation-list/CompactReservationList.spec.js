import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import TimeRange from 'shared/time-range';
import CompactReservationList from './CompactReservationList';

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
    return shallow(<CompactReservationList {...defaultProps} {...extraProps} />);
  }

  const wrapper = getWrapper();

  it('renders a list for selected reservations', () => {
    const ul = wrapper.find('ul');
    expect(ul.length).to.equal(1);
  });

  it('renders a list element for each selected reservation', () => {
    const li = wrapper.find('li');
    expect(li.length).to.equal(defaultProps.reservations.length);
  });

  it('displays a TimeRange for each selected reservation', () => {
    const timeRange = wrapper.find(TimeRange);
    expect(timeRange.length).to.equal(defaultProps.reservations.length);
  });

  describe('rendering resource name', () => {
    it('renders resource name if correct resource is given', () => {
      const li = wrapper.find('li').at(0);
      expect(li.text()).to.contain(resource.name);
    });

    it('does not render resource name if correct resource is not given', () => {
      const li = getWrapper({ resources: undefined }).find('li').at(0);
      expect(li.text()).to.not.contain(resource.name);
    });
  });

  describe('subtitle', () => {
    it('is rendered if subtitle is specified', () => {
      const reservations = [Reservation.build({ foo: 'bar' })];
      const props = { reservations, subtitle: 'foo' };
      const subtitle = getWrapper(props).find('.compact-reservation-list-subtitle');
      expect(subtitle).to.have.length(1);
      expect(subtitle.text()).to.equal(reservations[0].foo);
    });

    it('is not rendered if subtitle is not specified', () => {
      expect(getWrapper().find('.compact-reservation-list-subtitle')).to.have.length(0);
    });
  });

  describe('remove button', () => {
    it('is rendered if reservation is in removableReservations', () => {
      const reservations = [Reservation.build({ foo: 'bar' })];
      const removableReservations = [
        Reservation.build(),
        Reservation.build(),
      ];
      const props = { reservations, removableReservations };
      const buttons = getWrapper(props).find({ glyph: 'remove-circle' });
      expect(buttons).to.have.length(2);
    });

    it('passes onRemoveClick func to onClick prop', () => {
      const onRemoveClick = simple.mock();
      const removableReservations = [Reservation.build()];
      const props = { onRemoveClick, removableReservations };
      const button = getWrapper(props).find({ glyph: 'remove-circle' });
      expect(onRemoveClick.callCount).to.equal(0);
      button.prop('onClick')();
      expect(onRemoveClick.lastCall.args).to.deep.equal(
        [removableReservations[0].begin]
      );
    });
  });
});
