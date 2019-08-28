import React from 'react';
import Panel from 'react-bootstrap';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';

const ResourcePanel = ({
  t, defaultExpanded = true, titleId, children
}) => {
  return (
    <div className="app-ResourcePanel">
      <Panel defaultExpanded={defaultExpanded}>
        <Panel.Heading>
          <Panel.Toggle>
            <Panel.Title componentClass="h3">{t(titleId)}</Panel.Title>
          </Panel.Toggle>
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
  titleId: PropTypes.string,
  children: PropTypes.element,
  t: PropTypes.func
};

export default injectT(ResourcePanel);
