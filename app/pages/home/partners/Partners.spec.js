import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import vaakaImage from './images/vaaka.png';
import hginvarhaiskasvatusImage from './images/hginvarhaiskasvatus.png';
import kaupunginkirjatoImage from './images/kaupunginkirjato.png';
import Partners from './Partners';

describe('pages/home/partners/Partners', () => {
  let component;

  before(() => {
    component = shallow(<Partners />);
  });

  it('is a div', () => {
    expect(component.is('div')).to.be.true;
  });

  it('has partners className', () => {
    expect(component.prop('className')).to.equal('partners');
  });

  describe('partners images', () => {
    let images;

    before(() => {
      images = component.children().filter('.partners-images').children();
    });

    it('contains 3 image containers', () => {
      expect(images).to.have.length(3);
      expect(images.filter('.partner-image-wrapper')).to.have.length(3);
    });

    it('has Nuorisoasiainkeskus image', () => {
      expect(images.find({
        alt: 'nuorisoasiainkeskus',
        src: vaakaImage,
      })).to.have.length(1);
    });

    it('has Helsingin kaupunginkirjasto image', () => {
      expect(images.find({
        alt: 'Helsingin kaupunginkirjasto',
        src: kaupunginkirjatoImage,
      })).to.have.length(1);
    });

    it('has Helsingin kaupunki - Varhaiskasvatusvirasto image', () => {
      expect(images.find({
        alt: 'Helsingin kaupunki - Varhaiskasvatusvirasto',
        src: hginvarhaiskasvatusImage,
      })).to.have.length(1);
    });
  });
});
