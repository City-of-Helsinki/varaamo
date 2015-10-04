import { expect } from 'chai';

import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import { resourcePageSelectors } from 'selectors/resourcePageSelectors';

describe('Selectors: resourcePageSelectors', () => {
  const resources = [
    Resource.build(),
    Resource.build(),
  ];
  let state;

  beforeEach(() => {
    state = {
      router: {
        params: {
          id: resources[0].id,
        },
      },
      resources: Immutable({
        [resources[0].id]: resources[0],
        [resources[1].id]: resources[1],
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
      state.router.params.id = 'unfetched-resource-id';
      const selected = resourcePageSelectors(state);

      expect(selected.resource).to.deep.equal({});
    });
  });
});
