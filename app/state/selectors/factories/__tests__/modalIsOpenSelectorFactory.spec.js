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
  test('returns a function', () => {
    expect(typeof modalIsOpenSelectorFactory()).to.equal('function');
  });

  describe('the returned function', () => {
    const modalType = 'SOME_MODAL';

    test('returns true if given modal is in open modals', () => {
      const selector = modalIsOpenSelectorFactory(modalType);
      const state = getState([modalType]);

      expect(selector(state)).to.equal(true);
    });

    test('returns false if given modal is not in open modals', () => {
      const selector = modalIsOpenSelectorFactory(modalType);
      const state = getState([]);

      expect(selector(state)).to.equal(false);
    });
  });
});
