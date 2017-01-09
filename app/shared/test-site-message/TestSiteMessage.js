import React, { PropTypes } from 'react';
import Alert from 'react-bootstrap/lib/Alert';

import constants from 'constants/AppConstants';
import { injectT } from 'i18n';

function TestSiteMessage({ t }) {
  if (!constants.SHOW_TEST_SITE_MESSAGE) {
    return <span />;
  }
  return (
    <Alert bsStyle="danger" className="test-site-message">
      {t('TestSiteMessage.text')}
    </Alert>
  );
}

TestSiteMessage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(TestSiteMessage);
