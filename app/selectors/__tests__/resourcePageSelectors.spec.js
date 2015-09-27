import chai, {expect} from 'chai';
import chaiImmutable from 'chai-immutable';

import {fromJS} from 'immutable';

import {resourcePageSelectors} from 'selectors/resourcePageSelectors';

chai.use(chaiImmutable);

describe('Selectors: resourcePageSelectors', () => {
  const state = {
    router: {
      params: {
        id: 'r-2',
      },
    },
    resources: fromJS({
      'r-1': {id: 'r-1', name: 'Some resource'},
      'r-2': {id: 'r-2', name: 'Other resource'},
    }),
  };

  describe('selected values', () => {
    it('should return the resource corresponding to the router.params.id', () => {
      const selected = resourcePageSelectors(state);
      const expected = state.resources.get('r-2');
      expect(selected.resource).to.deep.equal(expected);
    });
  });
});
