import React from 'react';

import { getCurrentCustomization } from 'utils/customizationUtils';
import helsinkiLogoSrc from './helsinki-coat-of-arms-white.png';
import espooLogoSrc from './espoo-logo.png';

function Logo() {
  switch (getCurrentCustomization()) {

    case 'ESPOO': {
      return (
        <img
          alt="Espoon kaupunki"
          src={espooLogoSrc}
        />
      );
    }

    default: {
      return (
        <img
          alt="Helsingin vaakuna"
          src={helsinkiLogoSrc}
        />
      );
    }
  }
}

Logo.propTypes = {};

export default Logo;
