import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import modalIsOpenSelectorFactory from 'state/selectors/factories/modalIsOpenSelectorFactory';

function getState(openModals) {
  return {
    ui: Immutable({
      modals: {
        open: openModals,
      },
    }),
  };
}

describe('Selector factory: modalIsOpenSelectorFactory', () => {
  it('returns a function', () => {
    expect(typeof modalIsOpenSelectorFactory()).to.equal('function');
  });

  describe('the returned function', () => {
    const modalType = 'SOME_MODAL';

    it('returns true if given modal is in open modals', () => {
      const selector = modalIsOpenSelectorFactory(modalType);
      const state = getState([modalType]);

      expect(selector(state)).to.equal(true);
    });

    it('returns false if given modal is not in open modals', () => {
      const selector = modalIsOpenSelectorFactory(modalType);
      const state = getState([]);

      expect(selector(state)).to.equal(false);
    });
  });
});
