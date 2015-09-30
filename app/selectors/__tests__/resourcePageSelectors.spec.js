import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import { resourcePageSelectors } from 'selectors/resourcePageSelectors';

describe('Selectors: resourcePageSelectors', () => {
  let state;

  beforeEach(() => {
    state = {
      router: {
        params: {
          id: 'r-2',
        },
      },
      resources: Immutable({
        'r-1': { id: 'r-1', name: 'Some resource' },
        'r-2': { id: 'r-2', name: 'Other resource' },
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
      const resourceId = state.router.params.id;
      const expected = state.resources[resourceId];

      expect(selected.resource).to.deep.equal(expected);
    });

    it('should return an empty object as resource if resource with given id is not fetched', () => {
      state.router.params.id = 'r-9999';
      const selected = resourcePageSelectors(state);

      expect(selected.resource).to.deep.equal({});
    });
  });
});
