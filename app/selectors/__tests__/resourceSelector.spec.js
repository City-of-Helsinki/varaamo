import { expect } from 'chai';

import indexBy from 'lodash/collection/indexBy';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import resourceSelector from 'selectors/resourceSelector';

function getState(resources) {
  return {
    data: Immutable({
      resources: indexBy(resources, 'id'),
    }),
  };
}

function getProps(id) {
  return {
    params: {
      id,
    },
  };
}

describe('Selector: resourceSelector', () => {
  it('should return the resource corresponding to the router.params.id', () => {
    const resource = Resource.build();
    const state = getState([resource]);
    const props = getProps(resource.id);
    const actual = resourceSelector(state, props);

    expect(actual).to.deep.equal(resource);
  });

  it('should return an empty object as resource if resource with given id is not fetched', () => {
    const state = getState([]);
    const props = getProps('unfetched-id');
    const actual = resourceSelector(state, props);

    expect(actual).to.deep.equal({});
  });
});
