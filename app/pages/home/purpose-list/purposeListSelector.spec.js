import { expect } from 'chai';

import ActionTypes from 'constants/ActionTypes';
import { getState } from 'utils/testUtils';
import purposeListSelector from './purposeListSelector';

describe('pages/home/purpose-list/purposeListSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return purposeListSelector(state);
  }

  describe('isFetchingPurposes', () => {
    it('returns true if PURPOSES_GET_REQUEST is active', () => {
      const activeRequests = { [ActionTypes.API.PURPOSES_GET_REQUEST]: 1 };
      const selected = getSelected({
        'api.activeRequests': activeRequests,
      });
      expect(selected.isFetchingPurposes).to.be.true;
    });

    it('returns false if PURPOSES_GET_REQUEST is not active', () => {
      expect(getSelected().isFetchingPurposes).to.be.false;
    });
  });

  describe('purposes', () => {
    it('returns array of purposes from the state', () => {
      const purposes = {
        1: { id: 1, parent: null },
        2: { id: 2, parent: null },
      };
      const selected = getSelected({ 'data.purposes': purposes });
      const expected = [purposes[1], purposes[2]];
      expect(selected.purposes).to.deep.equal(expected);
    });

    it('returns only purposes that do not have a parent', () => {
      const purposes = {
        1: { id: 1, parent: 'some-parent' },
        2: { id: 2, parent: null },
      };
      const selected = getSelected({ 'data.purposes': purposes });
      const expected = [purposes[2]];
      expect(selected.purposes).to.deep.equal(expected);
    });
  });
});
