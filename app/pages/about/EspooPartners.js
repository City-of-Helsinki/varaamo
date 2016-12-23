import React, { PropTypes } from 'react';

import { injectT } from 'i18n';
import aikaLogoSrc from './images/aika-logo.png';
import eakrLogoSrc from './images/eakr-logo.png';
import euVipuvoimaaLogoSrc from './images/eu-vipuvoimaa-logo.png';

function EspooPartners({ t }) {
  return (
    <div className="about-page-logos">
      <a href="http://6aika.fi/6aika-avoimia-ja-alykkaita-palveluja/">
        <img
          alt={t('EspooPartners.aikaLogoAlt')}
          className="aika-logo"
          src={aikaLogoSrc}
        />
      </a>
      <a href="http://www.rakennerahastot.fi/">
        <img
          alt={t('EspooPartners.euVipuvoimaaLogoAlt')}
          className="eu-vipuvoimaa-logo"
          src={euVipuvoimaaLogoSrc}
        />
        <img
          alt={t('EspooPartners.eakrLogoAlt')}
          className="eakr-logo"
          src={eakrLogoSrc}
        />
      </a>
    </div>
  );
}

EspooPartners.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(EspooPartners);
