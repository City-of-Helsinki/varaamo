import PropTypes from 'prop-types';
import React from 'react';

import injectT from '../../i18n/injectT';

function AccessibilityShortcuts({ t, mainContentId }) {
  const mainContentHref = `#${mainContentId}`;

  return (
    <div className="accessibility-shortcuts">
      <a
        className="sr-only skip-link"
        href={mainContentHref}
      >
        {t('AccessibilityShortcuts.skipToContent')}
      </a>
    </div>
  );
}

AccessibilityShortcuts.propTypes = {
  t: PropTypes.func.isRequired,
  mainContentId: PropTypes.string.isRequired,
};

export default injectT(AccessibilityShortcuts);
