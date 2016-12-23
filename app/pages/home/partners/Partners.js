import React, { PropTypes } from 'react';

import { injectT } from 'i18n';
import nuorisoasiainkeskusImage from './images/vaaka.png';
import kaupunginkirjatoImage from './images/kaupunginkirjato.png';
import varhaiskasvatusvirastoImage from './images/hginvarhaiskasvatus.png';

function renderImage(src, alt) {
  return (
    <div className="partner-image-wrapper">
      <img alt={alt} src={src} />
    </div>
  );
}

function Partners({ t }) {
  return (
    <div className="partners">
      <div className="partners-images">
        {renderImage(nuorisoasiainkeskusImage, t('Partners.nuorisoasiainkeskusImageAlt'))}
        {renderImage(kaupunginkirjatoImage, t('Partners.kaupunginkirjatoImageAlt'))}
        {renderImage(varhaiskasvatusvirastoImage, t('Partners.varhaiskasvatusvirastoImageAlt'))}
      </div>
    </div>
  );
}

Partners.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(Partners);
