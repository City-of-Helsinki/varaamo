import React from 'react';
import PropTypes from 'prop-types';

import Label from '../Label';
import injectT from '../../../i18n/injectT';

function UnpublishedLabel({ t }) {
  return (
    <Label bsStyle="default" className="unpublished-label">
      {t('ResourceInfoContainer.unpublishedLabel')}
    </Label>
  );
}

UnpublishedLabel.propTypes = {
  t: PropTypes.func.isRequired,
};
export default injectT(UnpublishedLabel);
