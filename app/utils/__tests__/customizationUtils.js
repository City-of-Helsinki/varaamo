import { getCurrentCustomization } from '../customizationUtils';

describe('Utils: customizationUtils', () => {
  describe('getCurrentCustomization', () => {
    describe('when window.location.host does not match any customization', () => {
      test('returns null', () => {
        expect(getCurrentCustomization()).toBeNull();
      });
    });
  });
});
