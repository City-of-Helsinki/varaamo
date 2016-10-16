import React from 'react';

import vaakaImage from './images/vaaka.png';
import hginvarhaiskasvatusImage from './images/hginvarhaiskasvatus.png';
import kaupunginkirjatoImage from './images/kaupunginkirjato.png';


function renderImage(src, alt) {
  return (
    <div className="partner-image-wrapper">
      <img alt={alt} src={src} />
    </div>
  );
}


function Partners() {
  return (
    <div className="partners">
      <div className="partners-images">
        {renderImage(vaakaImage, 'nuorisoasiainkeskus')}
        {renderImage(kaupunginkirjatoImage, 'Helsingin kaupunginkirjasto')}
        {renderImage(hginvarhaiskasvatusImage, 'Helsingin kaupunki - Varhaiskasvatusvirasto')}
      </div>
    </div>
  );
}

export default Partners;
