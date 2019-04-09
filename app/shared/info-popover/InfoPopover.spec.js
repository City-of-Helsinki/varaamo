import { shallow } from 'enzyme';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';

import InfoPopover from './InfoPopover';

function getWrapper(props) {
  const defaults = {
    id: 'info-id',
    text: 'This is a popover!',
  };
  return shallow(<InfoPopover {...defaults} {...props} />);
}

describe('shared/info-popover/InfoPopover', () => {
  test('renders an OverlayTrigger with correct placement', () => {
    const placement = 'right';
    const trigger = getWrapper({ placement }).find(OverlayTrigger);
    expect(trigger).toHaveLength(1);
    expect(trigger.prop('placement')).toBe(placement);
  });

  test('renders a popover with correct text', () => {
    const text = 'Some text';
    const overlayTrigger = getWrapper({ text }).find(OverlayTrigger);
    const overlay = overlayTrigger.prop('overlay');
    expect(overlay.type).toBe(Popover);
    expect(overlay.props.children).toBe(text);
  });

  test('renders a "question-sign" glyphicon', () => {
    const glyphicon = getWrapper().find(Glyphicon);
    expect(glyphicon).toHaveLength(1);
    expect(glyphicon.prop('glyph')).toBe('question-sign');
  });
});
