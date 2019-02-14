import PropTypes from 'prop-types';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

InfoPopover.propTypes = {
  id: PropTypes.string.isRequired,
  placement: PropTypes.string,
  text: PropTypes.string.isRequired,
};
function InfoPopover({ id, placement, text }) {
  const popover = <Popover id={id}>{text}</Popover>;

  return (
    <OverlayTrigger overlay={popover} placement={placement || 'top'} trigger={['hover', 'focus']}>
      <Glyphicon className="info-popover" glyph="question-sign" />
    </OverlayTrigger>
  );
}


export default InfoPopover;
