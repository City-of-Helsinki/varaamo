import React from 'react';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import PropTypes from 'prop-types';

const PopoverOverlay = ({ content, title, trigger, children, placement }) => (
  <div className="app-PopoverOverlay">
    <OverlayTrigger
      overlay={
        <Popover id="app-PopoverOverlay__popover" title={title}>
          {content}
        </Popover>
      }
      placement={placement || 'top'}
      trigger={trigger || ['hover', 'focus']}
    >
      {children}
    </OverlayTrigger>
  </div>
);
PopoverOverlay.propTypes = {
  content: PropTypes.element,
  title: PropTypes.element,
  trigger: PropTypes.oneOf([PropTypes.string, PropTypes.array]),
  children: PropTypes.element,
  placement: PropTypes.string,
};

export default PopoverOverlay;
