import { expect } from 'chai';

import Image from 'utils/fixtures/Image';
import { getMainImage } from 'utils/imageUtils';

describe('Utils: imageUtils', () => {
  describe('getMainImage', () => {
    it('returns an empty object if images is undefined', () => {
      const images = undefined;

      expect(getMainImage(images)).to.deep.equal({});
    });

    it('returns an empty object if images is empty', () => {
      const images = [];

      expect(getMainImage(images)).to.deep.equal({});
    });

    it('returns the image that is of type "main"', () => {
      const images = [
        Image.build({ type: 'other' }),
        Image.build({ type: 'main' }),
        Image.build({ type: 'other' }),
      ];

      expect(getMainImage(images)).to.deep.equal(images[1]);
    });

    it('returns the first image that is of type "main"', () => {
      const images = [
        Image.build({ type: 'other' }),
        Image.build({ type: 'main' }),
        Image.build({ type: 'main' }),
      ];

      expect(getMainImage(images)).to.deep.equal(images[1]);
    });

    it('returns the first image if none of the images is of type "main"', () => {
      const images = [
        Image.build({ type: 'other' }),
        Image.build({ type: 'other' }),
      ];

      expect(getMainImage(images)).to.deep.equal(images[0]);
    });
  });
});
