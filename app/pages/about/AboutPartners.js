import React, { PropTypes } from 'react';

import { injectT } from 'i18n';
import aikaLogoSrc from './images/aika-logo.png';
import eakrLogoSrc from './images/eakr-logo.png';
import euVipuvoimaaLogoSrc from './images/eu-vipuvoimaa-logo.png';

function AboutPartners({ t }) {
  return (
    <div className="about-page-logos">
      <a href="http://6aika.fi/6aika-avoimia-ja-alykkaita-palveluja/">
        <img
          alt={t('AboutPartners.aikaLogoAlt')}
          className="aika-logo"
          src={aikaLogoSrc}
        />
      </a>
      <a href="http://www.rakennerahastot.fi/">
        <img
          alt={t('AboutPartners.euVipuvoimaaLogoAlt')}
          className="eu-vipuvoimaa-logo"
          src={euVipuvoimaaLogoSrc}
        />
        <img
          alt={t('AboutPartners.eakrLogoAlt')}
          className="eakr-logo"
          src={eakrLogoSrc}
        />
      </a>
    </div>
  );
}

AboutPartners.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(AboutPartners);
