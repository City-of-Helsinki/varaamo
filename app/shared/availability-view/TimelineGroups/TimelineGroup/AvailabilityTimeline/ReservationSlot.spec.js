import { expect } from 'chai';
import { shallow } from 'enzyme';
import simple from 'simple-mock';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import { UninjectedReservationSlot as ReservationSlot } from './ReservationSlot';
import Link from './Link';
import utils from '../utils';

function getWrapper(props) {
  const defaults = {
    begin: '2017-01-01T10:00:00Z',
    end: '2017-01-01T10:30:00Z',
    resourceId: '1',
    isSelectable: true,
    t: s => s,
  };
  return shallow(<ReservationSlot {...defaults} {...props} />);
}

describe('shared/availability-view/ReservationSlot', () => {
  it('returns a Link.reservation-slot', () => {
    const wrapper = getWrapper();
    expect(wrapper.is(Link)).to.be.true;
    expect(wrapper.hasClass('reservation-slot')).to.be.true;
  });

  it('has correct width', () => {
    const expected = utils.getTimeSlotWidth();
    const actual = getWrapper().prop('style');
    expect(actual).to.deep.equal({ width: expected });
  });

  it('binds onClick to handleClick', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    expect(wrapper.prop('onClick')).to.equal(instance.handleClick);
  });

  describe('OverlayTrigger', () => {
    function getTrigger(props) {
      const wrapper = getWrapper(props);
      return wrapper.find(OverlayTrigger);
    }

    describe('is not rendered when the slot', () => {
      it('has no selection', () => {
        const trigger = getTrigger({ selection: null });
        expect(trigger).to.have.length(0);
      });

      it('is not in selection', () => {
        const trigger = getTrigger({
          begin: '2016-01-01T10:00:00Z',
          end: '2016-01-01T10:30:00Z',
          selection: {
            begin: '2016-01-01T10:30:00Z',
            end: '2016-01-01T12:00:00Z',
            resourceId: '1',
          },
        });
        expect(trigger).to.have.length(0);
      });

      it('is inside selection but not the first slot', () => {
        const trigger = getTrigger({
          begin: '2016-01-01T10:00:00Z',
          end: '2016-01-01T10:30:00Z',
          selection: {
            begin: '2016-01-01T09:30:00Z',
            end: '2016-01-01T12:00:00Z',
            resourceId: '1',
          },
        });
        expect(trigger).to.have.length(0);
      });

      it('is inside hover selection', () => {
        const trigger = getTrigger({
          begin: '2016-01-01T10:00:00Z',
          end: '2016-01-01T10:30:00Z',
          selection: {
            begin: '2016-01-01T10:00:00Z',
            end: '2016-01-01T12:00:00Z',
            resourceId: '1',
            hover: true,
          },
        });
        expect(trigger).to.have.length(0);
      });
    });

    it('is rendered if beginning of selection', () => {
      const trigger = getTrigger({
        begin: '2016-01-01T10:00:00Z',
        end: '2016-01-01T10:30:00Z',
        selection: {
          begin: '2016-01-01T10:00:00Z',
          end: '2016-01-01T12:00:00Z',
          resourceId: '1',
        },
      });
      expect(trigger).to.have.length(1);
    });
  });

  describe('selection', () => {
    function isSelected(props, selection) {
      const defaultProps = {
        begin: '2016-01-01T10:00:00',
        end: '2016-01-01T10:30:00',
        selection: {
          begin: '2016-01-01T10:00:00',
          end: '2016-01-01T11:00:00',
          resourceId: '1',
          ...selection,
        },
        resourceId: '1',
      };
      const wrapper = getWrapper({ ...defaultProps, ...props });
      return wrapper.find(Link).hasClass('reservation-slot-selected');
    }

    it('is selected if begin and end are same as selected', () => {
      const actual = isSelected({}, { end: '2016-01-01T10:30:00' });
      expect(actual).to.be.true;
    });

    it('is selected if begin and end are inside selected', () => {
      const actual = isSelected({}, { begin: '2016-01-01T09:00:00' });
      expect(actual).to.be.true;
    });

    it('is not selected if begin before selection', () => {
      const actual = isSelected({}, { begin: '2016-01-01T10:15:00' });
      expect(actual).to.be.false;
    });

    it('is not selected if end after selection', () => {
      const actual = isSelected({}, { end: '2016-01-01T10:15:00' });
      expect(actual).to.be.false;
    });

    it('is not selected if no selection', () => {
      const wrapper = getWrapper();
      const actual = wrapper.hasClass('reservation-slot-selected');
      expect(actual).to.be.false;
    });

    it('is not selected if selection.resourceId is different', () => {
      const actual = isSelected({}, { resourceId: '2' });
      expect(actual).to.be.false;
    });

    it('is selected if selection.resourceId is the same', () => {
      const actual = isSelected({}, { resourceId: '1' });
      expect(actual).to.be.true;
    });
  });

  describe('handleClick', () => {
    describe('if onClick given', () => {
      function callHandleClick({ preventDefault }, props) {
        const wrapper = getWrapper({ onClick: () => null, ...props });
        const event = { preventDefault: preventDefault || (() => null) };
        return wrapper.instance().handleClick(event);
      }

      it('calls event.preventDefault', () => {
        const preventDefault = simple.mock();
        callHandleClick({ preventDefault });
        expect(preventDefault.callCount).to.equal(1);
      });

      it('calls onClick', () => {
        const onClick = simple.mock();
        const begin = '2017-01-02T14:00:00Z';
        const end = '2017-01-02T14:30:00Z';
        const resourceId = 'auuxn391';
        callHandleClick({}, { begin, end, onClick, resourceId });
        expect(onClick.callCount).to.equal(1);
        expect(onClick.lastCall.args).to.deep.equal([{ begin, end, resourceId }]);
      });

      it('does nothing if not isSelectable', () => {
        const onClick = simple.mock();
        callHandleClick({}, { onClick, isSelectable: false });
        expect(onClick.called).to.be.false;
      });
    });

    describe('if no click handler', () => {
      function callHandleClick({ preventDefault }) {
        const wrapper = getWrapper({ onClick: undefined });
        const event = { preventDefault: preventDefault || (() => null) };
        return wrapper.instance().handleClick(event);
      }

      it('does not call event.preventDefault', () => {
        const preventDefault = simple.mock();
        callHandleClick({ preventDefault });
        expect(preventDefault.called).to.be.false;
      });
    });
  });
});
