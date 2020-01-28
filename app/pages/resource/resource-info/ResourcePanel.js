import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PropTypes from 'prop-types';


const ResourcePanel = ({
  defaultExpanded = true, header, children,
}) => {
  return (
    <div className="app-ResourcePanel">
      <Panel defaultExpanded={defaultExpanded}>
        <Panel.Heading>
          <Panel.Title componentClass="h3" toggle>{header}</Panel.Title>
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
  header: PropTypes.string,
  children: PropTypes.element,
};

export default ResourcePanel;
