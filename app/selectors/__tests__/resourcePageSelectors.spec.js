import chai, {expect} from 'chai';
import chaiImmutable from 'chai-immutable';

import {fromJS, Map} from 'immutable';

import {resourcePageSelectors} from 'selectors/resourcePageSelectors';

chai.use(chaiImmutable);

describe('Selectors: resourcePageSelectors', () => {
  let state;

  beforeEach(() => {
    state = {
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
  });

  describe('selected values', () => {
    it('should return the id in router.params.id', () => {
      const selected = resourcePageSelectors(state);
      const expected = state.router.params.id;
      expect(selected.id).to.equal(expected);
    });

    it('should return the resource corresponding to the router.params.id', () => {
      const selected = resourcePageSelectors(state);
      const expected = state.resources.get('r-2');
      expect(selected.resource).to.deep.equal(expected);
    });

    it('should return empty Map as resource if resource with given id is not fetched', () => {
      state.router.params.id = 'r-9999';
      const selected = resourcePageSelectors(state);
      const expected = Map();
      expect(selected.resource).to.deep.equal(expected);
    });
  });
});
