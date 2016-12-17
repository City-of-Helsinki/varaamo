import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from 'utils/testUtils';
import vaakaImage from './images/vaaka.png';
import hginvarhaiskasvatusImage from './images/hginvarhaiskasvatus.png';
import kaupunginkirjatoImage from './images/kaupunginkirjato.png';
import Partners from './Partners';

describe('pages/home/partners/Partners', () => {
  function getWrapper() {
    return shallowWithIntl(<Partners />);
  }

  it('renders partners div', () => {
    const partnersDiv = getWrapper().find('.partners');
    expect(partnersDiv.length).to.equal(1);
  });

  describe('partners images', () => {
    let images;

    before(() => {
      images = getWrapper().find('img');
    });

    it('contains 3 image containers', () => {
      expect(images).to.have.length(3);
    });

    it('has Nuorisoasiainkeskus image', () => {
      expect(images.find({
        alt: 'Partners.nuorisoasiainkeskusImageAlt',
        src: vaakaImage,
      })).to.have.length(1);
    });

    it('has Helsingin kaupunginkirjasto image', () => {
      expect(images.find({
        alt: 'Partners.kaupunginkirjatoImageAlt',
        src: kaupunginkirjatoImage,
      })).to.have.length(1);
    });

    it('has Helsingin kaupunki - Varhaiskasvatusvirasto image', () => {
      expect(images.find({
        alt: 'Partners.varhaiskasvatusvirastoImageAlt',
        src: hginvarhaiskasvatusImage,
      })).to.have.length(1);
    });
  });
});
