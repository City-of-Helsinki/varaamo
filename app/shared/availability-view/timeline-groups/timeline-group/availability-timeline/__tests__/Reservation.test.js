import { shallow } from 'enzyme';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import simple from 'simple-mock';

import Reservation from '../Reservation';

function getOuterWrapper(props) {
  const defaults = {
    begin: '2016-01-01T10:00:00Z',
    end: '2016-01-01T12:00:00Z',
    eventSubject: 'Meeting',
    id: 12345,
    onClick: () => { },
  };
  return shallow(<Reservation {...defaults} {...props} />);
}

function getWrapper(props) {
  return getOuterWrapper(props).find('.reservation');
}

describe('shared/availability-view/Reservation', () => {
  test('renders a span.reservation', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('span.reservation')).toBe(true);
  });

  test('renders a button', () => {
    const wrapper = getOuterWrapper();
    expect(wrapper.is('button')).toBe(true);
  });

  test('renders an OverlayTrigger', () => {
    const trigger = getOuterWrapper().find(OverlayTrigger);
    expect(trigger).toHaveLength(1);
  });

  test('renders a popover', () => {
    const overlayTrigger = getOuterWrapper().find(OverlayTrigger);
    const overlay = overlayTrigger.prop('overlay');
    expect(overlay.type).toBe(Popover);
  });

  test('on click it calls prop.onClick and passes reservation data', () => {
    const onClick = simple.mock();
    const reservation = {
      begin: '2016-01-01T10:00:00Z',
      end: '2016-01-01T12:00:00Z',
      eventSubject: 'Meeting',
      id: 12345,
      userPermissions: {
        canModify: true,
      },
    };
    const wrapper = getOuterWrapper({ ...reservation, onClick });
    const onClickProp = wrapper.prop('onClick');
    expect(onClick.callCount).toBe(0);
    onClickProp();
    expect(onClick.callCount).toBe(1);
    expect(onClick.lastCall.args[0]).toEqual(reservation);
  });

  test(
    'adds class with-comments to reservation-link if reservation has comments',
    () => {
      const reservation = {
        begin: '2016-01-01T10:00:00Z',
        end: '2016-01-01T12:00:00Z',
        eventSubject: 'Meeting',
        id: 12345,
        comments: 'comment',
      };
      const element = getOuterWrapper({ ...reservation }).find('.with-comments');
      expect(element).toHaveLength(1);
    }
  );

  test(
    'does not add class with-comments to reservation-link if reservation has no comments',
    () => {
      const reservation = {
        begin: '2016-01-01T10:00:00Z',
        end: '2016-01-01T12:00:00Z',
        eventSubject: 'Meeting',
        id: 12345,
      };
      const element = getOuterWrapper({ ...reservation }).find('.with-comments');
      expect(element).toHaveLength(0);
    }
  );

  test(
    'adds class requested to reservation if reservation state is requested',
    () => {
      const element = getWrapper({ state: 'requested' }).find('.requested');
      expect(element).toHaveLength(1);
    }
  );

  test(
    'does not add class requested to reservation if reservation state is not requested',
    () => {
      const element = getWrapper({ state: 'approved' }).find('.requested');
      expect(element).toHaveLength(0);
    }
  );

  test('renders eventSubject', () => {
    const eventSubject = 'Meeting GUQ';
    const element = getWrapper({ eventSubject }).find('.event-subject');
    expect(element).toHaveLength(1);
    expect(element.text()).toBe(eventSubject);
  });

  describe('reserver name', () => {
    function getReserverName(extra) {
      const wrapper = getWrapper({
        reserverName: 'Luke Skywalker',
        user: {
          displayName: 'DarthV',
          email: 'dv@dark.side',
        },
        ...extra,
      });
      return wrapper.find('.reserver-name').text();
    }

    test('is rendered from reserverName', () => {
      expect(getReserverName()).toBe('Luke Skywalker');
    });

    test('is rendered from user.displayName if no reserverName', () => {
      expect(getReserverName({ reserverName: undefined })).toBe('DarthV');
    });

    test('is rendered from email if no others', () => {
      const props = { reserverName: undefined, user: { email: 'dv@dark.side' } };
      expect(getReserverName(props)).toBe('dv@dark.side');
    });
  });
});
