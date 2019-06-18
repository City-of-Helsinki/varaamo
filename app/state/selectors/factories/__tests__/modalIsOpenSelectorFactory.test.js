import Immutable from 'seamless-immutable';

import modalIsOpenSelectorFactory from '../modalIsOpenSelectorFactory';

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
    expect(typeof modalIsOpenSelectorFactory()).toBe('function');
  });

  describe('the returned function', () => {
    const modalType = 'SOME_MODAL';

    test('returns true if given modal is in open modals', () => {
      const selector = modalIsOpenSelectorFactory(modalType);
      const state = getState([modalType]);

      expect(selector(state)).toBe(true);
    });

    test('returns false if given modal is not in open modals', () => {
      const selector = modalIsOpenSelectorFactory(modalType);
      const state = getState([]);

      expect(selector(state)).toBe(false);
    });
  });
});
