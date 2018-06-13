import React, { PropTypes } from 'react';

import { injectT } from 'i18n';
import { getCurrentCustomization } from 'utils/customizationUtils';
import helsinkiLogoSrc from './helsinki-logo-white.png';
import espooLogoSrc from './espoo-blue-logo.png';
import vantaaLogoSrc from './vantaa-logo.png';

function Logo({ t }) {
  switch (getCurrentCustomization()) {

    case 'ESPOO': {
      return (
        <img
          alt={t('Logo.espooAlt')}
          src={espooLogoSrc}
        />
      );
    }

    case 'VANTAA': {
      return (
        <img
          alt={t('Logo.vantaaAlt')}
          src={vantaaLogoSrc}
        />
      );
    }

    default: {
      return (
        <img
          alt={t('Logo.helsinkiAlt')}
          src={helsinkiLogoSrc}
        />
      );
    }
  }
}

Logo.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(Logo);
