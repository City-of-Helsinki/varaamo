import keyBy from 'lodash/keyBy';
import Immutable from 'seamless-immutable';

import Resource from '../../../utils/fixtures/Resource';
import Unit from '../../../utils/fixtures/Unit';
import User from '../../../utils/fixtures/User';
import resourcePageSelector from '../resourcePageSelector';

const defaultUser = User.build();

function getState(resources = [], units = [], user = defaultUser) {
  return {
    api: Immutable({
      activeRequests: [],
    }),
    auth: Immutable({
      userId: user.id,
      token: 'mock-token',
    }),
    data: Immutable({
      resources: keyBy(resources, 'id'),
      units: keyBy(units, 'id'),
      users: { [user.id]: user },
    }),
    ui: Immutable({
      resourceMap: Immutable({
        showMap: true,
      }),
    }),
  };
}

function getProps(id = 'some-id') {
  return {
    location: {
      search: 'date=2015-10-10',
    },
    match: {
      params: {
        id,
      },
    },
  };
}

describe('pages/resource/resourcePageSelector', () => {
  test('returns date', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);

    expect(selected.date).toBeDefined();
  });

  test('returns the id in router.params.id', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);
    const expected = props.match.params.id;

    expect(selected.id).toBe(expected);
  });

  test('returns isAdmin', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);

    expect(selected.isAdmin).toBeDefined();
  });

  test('returns isFetchingResource', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);

    expect(selected.isFetchingResource).toBeDefined();
  });

  test('returns isLoggedIn', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);

    expect(selected.isLoggedIn).toBeDefined();
  });

  test('returns resource', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);

    expect(selected.resource).toBeDefined();
  });

  test('returns showMap', () => {
    const state = getState();
    const props = getProps();
    const selected = resourcePageSelector(state, props);

    expect(selected.showMap).toBeDefined();
  });

  test('returns the unit corresponding to the resource.unit', () => {
    const unit = Unit.build();
    const resource = Resource.build({ unit: unit.id });
    const state = getState([resource], [unit]);
    const props = getProps(resource.id);
    const selected = resourcePageSelector(state, props);

    expect(selected.unit).toEqual(unit);
  });

  test(
    'returns an empty object as the unit if unit with the given id is not fetched',
    () => {
      const resource = Resource.build();
      const state = getState([resource], []);
      const props = getProps(resource.id);
      const selected = resourcePageSelector(state, props);

      expect(selected.unit).toEqual({});
    }
  );

  test('returns an empty object as the unit if resource is not fetched', () => {
    const state = getState([], []);
    const props = getProps('unfetched-id');
    const selected = resourcePageSelector(state, props);

    expect(selected.unit).toEqual({});
  });
});
