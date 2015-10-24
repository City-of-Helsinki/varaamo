import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import resourceSelector from 'selectors/resourceSelector';

function getState(resources, id) {
  return {
    data: Immutable({
      resources: _.indexBy(resources, 'id'),
    }),
    router: {
      params: {
        id,
      },
    },
  };
}

describe('Selector: resourceSelector', () => {
  it('should return the resource corresponding to the router.params.id', () => {
    const resource = Resource.build();
    const state = getState([resource], resource.id);
    const actual = resourceSelector(state);

    expect(actual).to.deep.equal(resource);
  });

  it('should return an empty object as resource if resource with given id is not fetched', () => {
    const state = getState([], 'unfetched-id');
    const actual = resourceSelector(state);

    expect(actual).to.deep.equal({});
  });
});
