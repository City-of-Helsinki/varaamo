import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';

import injectT from '../../../i18n/injectT';

function ResourceSpecificTerms({ resource, t }) {
  return (
    <Panel>
      <h3>{t('ResourcePage.specificTerms')}</h3>
      <Row>
        {resource.specificTerms}
      </Row>
    </Panel>
  );
}

ResourceSpecificTerms.propTypes = {
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceSpecificTerms);
