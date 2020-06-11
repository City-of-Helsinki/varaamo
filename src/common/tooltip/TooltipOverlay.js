import React from 'react';
import { OverlayTrigger, Tooltip as BTTooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';

const TooltipOverlay = ({ children, content, placement, ...rest }) => {
  return (
    <div className="app-TooltipOverlay">
      <OverlayTrigger
        overlay={<BTTooltip id={`tooltip-${placement}`}>{content}</BTTooltip>}
        placement={placement || 'top'}
        {...rest}
      >
        {children}
      </OverlayTrigger>
    </div>
  );
};

TooltipOverlay.propTypes = {
  children: PropTypes.element.isRequired,
  content: PropTypes.element.isRequired,
  placement: PropTypes.string,
};

export default TooltipOverlay;
