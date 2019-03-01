import { slotSize } from 'constants/SlotConstants';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import mockDate from 'mockdate';
import moment from 'moment';
import React from 'react';

import AvailabilityTimeline from './AvailabilityTimeline';
import AvailabilityTimelineContainer, { selector } from './AvailabilityTimelineContainer';

function getState() {
  return {
    data: {
      resources: {
        'resource-1': {
          id: 'resource-1',
          reservations: [
            {
              id: 111,
              name: 'Reservation 1',
              begin: moment('2016-01-01T02:00:00').format(),
              end: moment('2016-01-01T10:00:00').format(),
            },
            {
              id: 222,
              name: 'Reservation 2',
              begin: moment('2016-01-01T11:30:00').format(),
              end: moment('2016-01-01T18:00:00').format(),
            },
            {
              id: 333,
              name: 'Reservation 3',
              begin: moment('2016-01-01T18:00:00').format(),
              end: moment('2016-01-01T23:30:00').format(),
            },
            {
              id: 444,
              name: 'Cancelled reservation',
              begin: moment('2016-01-01T10:00:00').format(),
              end: moment('2016-01-01T10:30:00').format(),
              state: 'cancelled',
            },
            {
              id: 555,
              name: 'Denied reservation',
              begin: moment('2016-01-01T10:00:00').format(),
              end: moment('2016-01-01T10:30:00').format(),
              state: 'denied',
            },
          ],
        },
        'resource-2': { id: 'resource-2' },
      },
    },
  };
}

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01T00:00:00',
    id: 'resource-1',
    onReservationClick: () => null,
    store: { getState },
  };
  return shallow(<AvailabilityTimelineContainer {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityTimelineContainer', () => {
  it('renders a AvailabilityTimeline', () => {
    const wrapper = getWrapper();
    expect(wrapper.is(AvailabilityTimeline)).to.be.true;
  });

  it('renders a AvailabilityTimeline even if no reservations', () => {
    const wrapper = getWrapper({ id: 'resource-2' });
    expect(wrapper.is(AvailabilityTimeline)).to.be.true;
  });

  describe('selector', () => {
    function getSelected(props) {
      const defaults = { id: 'resource-1', date: '2016-01-01T00:00:00' };
      return selector()(getState(), { ...defaults, ...props });
    }

    describe('items', () => {
      before(() => {
        mockDate.set('2015-12-01T10:00:00Z');
      });

      after(() => {
        mockDate.reset();
      });

      it('contains slots if no reservations', () => {
        const actual = getSelected({ id: 'resource-2' }).items;
        expect(actual).to.have.length((24 * 60) / slotSize);
        actual.forEach(slot => expect(slot.type).to.equal('reservation-slot'));
      });

      it('contains slots if no reservations for date', () => {
        const actual = getSelected({ date: '2016-01-02T00:00:00' }).items;
        expect(actual).to.have.length((24 * 60) / slotSize);
        actual.forEach(slot => expect(slot.type).to.equal('reservation-slot'));
      });

      it('contains reservations and slots', () => {
        const state = getState();
        const reservations = state.data.resources['resource-1'].reservations;
        const props = { id: 'resource-1', date: '2016-01-01' };
        const actual = selector()(state, props).items;
        expect(actual[0].type).to.equal('reservation-slot');
        expect(actual[1].type).to.equal('reservation-slot');
        expect(actual[2].type).to.equal('reservation-slot');
        expect(actual[3].type).to.equal('reservation-slot');
        expect(actual[4]).to.deep.equal(
          { key: '4', type: 'reservation', data: reservations[0] },
        );
        expect(actual[5].type).to.equal('reservation-slot');
        expect(actual[6].type).to.equal('reservation-slot');
        expect(actual[7].type).to.equal('reservation-slot');
        expect(actual[8]).to.deep.equal(
          { key: '8', type: 'reservation', data: reservations[1] },
        );
        expect(actual[9]).to.deep.equal(
          { key: '9', type: 'reservation', data: reservations[2] },
        );
        expect(actual[10].type).to.equal('reservation-slot');
      });

      it('contains selectability info', () => {
        const state = getState();
        const reservations = state.data.resources['resource-1'].reservations;
        const selection = {
          begin: '2016-01-01T10:00:00',
          end: '2016-01-01T10:30:00',
          resourceId: 'resource-1',
        };
        const props = { id: 'resource-1', date: '2016-01-01', selection };
        const actual = selector()(state, props).items;
        expect(actual[0].data.isSelectable).to.be.false;
        expect(actual[1].data.isSelectable).to.be.false;
        expect(actual[2].data.isSelectable).to.be.false;
        expect(actual[3].data.isSelectable).to.be.false;
        expect(actual[4]).to.deep.equal(
          { key: '4', type: 'reservation', data: reservations[0] },
        );
        expect(actual[5].data.isSelectable).to.be.true;
        expect(actual[6].data.isSelectable).to.be.true;
        expect(actual[7].data.isSelectable).to.be.true;
        expect(actual[8]).to.deep.equal(
          { key: '8', type: 'reservation', data: reservations[1] },
        );
        expect(actual[9]).to.deep.equal(
          { key: '9', type: 'reservation', data: reservations[2] },
        );
        expect(actual[10].data.isSelectable).to.be.false;
      });
    });
  });
});
