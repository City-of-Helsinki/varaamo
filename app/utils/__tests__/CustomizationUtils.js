import { expect } from 'chai';

import { getCurrentCustomization } from 'utils/CustomizationUtils';

describe('Utils: CustomizationUtils', () => {
  describe('getCurrentCustomization', () => {
    describe('when window.location.host does not match any customization', () => {
      it('should return null', () => {
        expect(getCurrentCustomization()).to.equal(null);
      });
    });
  });
});
