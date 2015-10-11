import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import TimeSlot from 'fixtures/TimeSlot';
import { UnconnectedReservationForm as ReservationForm } from 'containers/ReservationForm';

describe('Container: ReservationForm', () => {
  const props = {
    isFetchingResource: false,
    timeSlots: Immutable([
      TimeSlot.build(),
      TimeSlot.build(),
    ]),
  };

  const tree = sd.shallowRender(<ReservationForm {...props} />);

  describe('rendering TimeSlots', () => {
    const timeSlotsTrees = tree.everySubTree('TimeSlots');
    const timeSlotsVdom = timeSlotsTrees[0].getRenderOutput();

    it('should render TimeSLots component', () => {
      expect(timeSlotsTrees.length).to.equal(1);
    });

    it('should pass correct props to TimeSLots component', () => {
      const actualProps = timeSlotsVdom.props;

      expect(actualProps.isFetching).to.equal(props.isFetchingResource);
      expect(actualProps.slots).to.deep.equal(props.timeSlots);
    });
  });
});
