import { expect } from 'chai';

import { getCurrentCustomization } from 'utils/customizationUtils';

describe('Utils: customizationUtils', () => {
  describe('getCurrentCustomization', () => {
    describe('when window.location.host does not match any customization', () => {
      it('returns null', () => {
        expect(getCurrentCustomization()).to.equal(null);
      });
    });
  });
});
