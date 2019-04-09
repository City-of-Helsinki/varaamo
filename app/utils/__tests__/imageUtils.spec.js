import Image from 'utils/fixtures/Image';
import { getMainImage } from 'utils/imageUtils';

describe('Utils: imageUtils', () => {
  describe('getMainImage', () => {
    test('returns an empty object if images is undefined', () => {
      const images = undefined;

      expect(getMainImage(images)).toEqual({});
    });

    test('returns an empty object if images is empty', () => {
      const images = [];

      expect(getMainImage(images)).toEqual({});
    });

    test('returns the image that is of type "main"', () => {
      const images = [
        Image.build({ type: 'other' }),
        Image.build({ type: 'main' }),
        Image.build({ type: 'other' }),
      ];

      expect(getMainImage(images)).toEqual(images[1]);
    });

    test('returns the first image that is of type "main"', () => {
      const images = [
        Image.build({ type: 'other' }),
        Image.build({ type: 'main' }),
        Image.build({ type: 'main' }),
      ];

      expect(getMainImage(images)).toEqual(images[1]);
    });

    test('returns the first image if none of the images is of type "main"', () => {
      const images = [
        Image.build({ type: 'other' }),
        Image.build({ type: 'other' }),
      ];

      expect(getMainImage(images)).toEqual(images[0]);
    });
  });
});
