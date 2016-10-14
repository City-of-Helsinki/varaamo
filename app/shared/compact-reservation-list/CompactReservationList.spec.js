import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

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
      expect(li.text()).to.contain(resource.name.fi);
    });

    it('does not render resource name if correct resource is not given', () => {
      const li = getWrapper({ resources: undefined }).find('li').at(0);
      expect(li.text()).to.not.contain(resource.name.fi);
    });
  });
});
