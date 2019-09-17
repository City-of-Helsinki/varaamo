import { shallow } from 'enzyme';
import simple from 'simple-mock';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import { shallowWithIntl } from '../../../utils/testUtils';
import ReservationPopover from '../ReservationPopover';

function getWrapper(props) {
  const defaultProps = {
    children: <div />,
    onCancel: simple.stub(),
    begin: '2016-01-01T10:00:00Z',
    end: '2016-01-01T12:00:00Z',
    reservationPrice: '',
  };
  return shallowWithIntl(<ReservationPopover {...defaultProps} {...props} />);
}

describe('shared/reservation-popover/ReservationPopover', () => {
  function getInternalPopover(props) {
    const overlay = getWrapper({
      ...props,
    }).find(OverlayTrigger);
    return shallow(overlay.prop('overlay'));
  }

  test('renders length with hours and minutes', () => {
    const span = getInternalPopover().find('.reservation-popover__length');
    expect(span.text()).toBe('(2h 0min)');
  });

  test('renders length with price', () => {
    const extraProps = {
      reservationPrice: '24.8',
    };
    const span = getInternalPopover(extraProps).find('.reservation-popover__price');
    expect(span.text()).toBe('24.8€');
  });

  test('renders length with only minutes if less than an hour', () => {
    const extraProps = {
      begin: '2016-01-01T10:00:00Z',
      end: '2016-01-01T10:30:00Z',
    };
    const span = getInternalPopover(extraProps).find('.reservation-popover__length');
    expect(span.text()).toBe('(30min)');
  });

  test('renders cancel icon', () => {
    const onCancel = () => null;
    const icon = getInternalPopover({ onCancel }).find('.reservation-popover__cancel');
    expect(icon.is(Glyphicon)).toBe(true);
    expect(icon.prop('glyph')).toBe('trash');
    expect(icon.prop('onClick')).toBe(onCancel);
  });
});
