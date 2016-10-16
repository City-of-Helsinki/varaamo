import { expect } from 'chai';
import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import resourceSelector from 'state/selectors/resourceSelector';
import Resource from 'utils/fixtures/Resource';

function getState(resources) {
  return {
    data: Immutable({
      resources: keyBy(resources, 'id'),
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
  it('returns the resource corresponding to the router.params.id', () => {
    const resource = Resource.build();
    const state = getState([resource]);
    const props = getProps(resource.id);
    const actual = resourceSelector(state, props);

    expect(actual).to.deep.equal(resource);
  });

  it('returns an empty object as resource if resource with given id is not fetched', () => {
    const state = getState([]);
    const props = getProps('unfetched-id');
    const actual = resourceSelector(state, props);

    expect(actual).to.deep.equal({});
  });
});
