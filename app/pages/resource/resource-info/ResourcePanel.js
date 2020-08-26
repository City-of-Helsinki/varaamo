import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PropTypes from 'prop-types';
import classNames from 'classnames';


const ResourcePanel = ({
  defaultExpanded = true, header, children, componentClass = 'h3', className,
}) => {
  return (
    <div className={classNames('app-ResourcePanel', className)}>
      <Panel defaultExpanded={defaultExpanded}>
        <Panel.Heading>
          <Panel.Title componentClass={componentClass} toggle>{header}</Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            {children}
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    </div>
  );
};

ResourcePanel.propTypes = {
  defaultExpanded: PropTypes.bool,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.element,
  componentClass: PropTypes.string,
  className: PropTypes.string,
};

export default ResourcePanel;
