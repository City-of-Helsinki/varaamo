import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from 'utils/testUtils';
import AboutPartners from './AboutPartners';
import aikaLogoSrc from './images/aika-logo.png';
import eakrLogoSrc from './images/eakr-logo.png';
import euVipuvoimaaLogoSrc from './images/eu-vipuvoimaa-logo.png';

describe('pages/about/AboutPartners', () => {
  function getWrapper() {
    return shallowWithIntl(<AboutPartners />);
  }

  test('renders div.about-page-logos', () => {
    const div = getWrapper().find('div.about-page-logos');
    expect(div).to.have.length(1);
  });

  describe('images', () => {
    let images;

    beforeAll(() => {
      images = getWrapper().find('img');
    });

    test('contains 3 images', () => {
      expect(images).to.have.length(3);
    });

    test('has 6 aika image', () => {
      expect(images.find({
        alt: 'AboutPartners.aikaLogoAlt',
        src: aikaLogoSrc,
      })).to.have.length(1);
    });

    test('has EU Vipuvoimaa image', () => {
      expect(images.find({
        alt: 'AboutPartners.euVipuvoimaaLogoAlt',
        src: euVipuvoimaaLogoSrc,
      })).to.have.length(1);
    });

    test('has eakr image', () => {
      expect(images.find({
        alt: 'AboutPartners.eakrLogoAlt',
        src: eakrLogoSrc,
      })).to.have.length(1);
    });
  });
});
