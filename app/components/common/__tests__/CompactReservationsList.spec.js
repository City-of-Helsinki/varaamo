import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import Immutable from 'seamless-immutable';

import CompactReservationsList from 'components/common/CompactReservationsList';
import TimeRange from 'shared/time-range';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';

describe('Component: common/CompactReservationsList', () => {
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
    return shallow(<CompactReservationsList {...defaultProps} {...extraProps} />);
  }

  const wrapper = getWrapper();

  it('should render a list for selected reservations', () => {
    const ul = wrapper.find('ul');
    expect(ul.length).to.equal(1);
  });

  it('should render a list element for each selected reservation', () => {
    const li = wrapper.find('li');
    expect(li.length).to.equal(defaultProps.reservations.length);
  });

  it('should display a TimeRange for each selected reservation', () => {
    const timeRange = wrapper.find(TimeRange);
    expect(timeRange.length).to.equal(defaultProps.reservations.length);
  });

  describe('rendering resource name', () => {
    it('should render resource name if correct resource is given', () => {
      const li = wrapper.find('li').at(0);
      expect(li.text()).to.contain(resource.name.fi);
    });

    it('should not render resource name if correct resource is not given', () => {
      const li = getWrapper({ resources: undefined }).find('li').at(0);
      expect(li.text()).to.not.contain(resource.name.fi);
    });
  });
});
