import React from 'react';
import PropTypes from 'prop-types';

import Label from 'shared/label';
import { injectT } from 'i18n';

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
