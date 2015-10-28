import { expect } from 'chai';

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import reservationPageSelector from 'selectors/containers/reservationPageSelector';

function getState(resources = [], units = [], resourceId = 'some-id') {
  return {
    api: Immutable({
      activeRequests: [],
    }),
    data: Immutable({
      resources: _.indexBy(resources, 'id'),
      units: _.indexBy(units, 'id'),
    }),
    router: {
      location: {
        query: {
          date: '2015-10-10',
        },
      },
      params: {
        id: resourceId,
      },
    },
  };
}

describe('Selector: reservationPageSelector', () => {
  it('should return date', () => {
    const state = getState();
    const selected = reservationPageSelector(state);

    expect(selected.date).to.exist;
  });

  it('should return the id in router.params.id', () => {
    const state = getState();
    const selected = reservationPageSelector(state);
    const expected = state.router.params.id;

    expect(selected.id).to.equal(expected);
  });

  it('should return isFetchingResource', () => {
    const state = getState();
    const selected = reservationPageSelector(state);

    expect(selected.isFetchingResource).to.exist;
  });

  it('should return resource', () => {
    const state = getState();
    const selected = reservationPageSelector(state);

    expect(selected.resource).to.exist;
  });

  it('should return the unit corresponding to the resource.unit', () => {
    const unit = Unit.build();
    const resource = Resource.build({ unit: unit.id });
    const state = getState([resource], [unit], resource.id);
    const selected = reservationPageSelector(state);

    expect(selected.unit).to.deep.equal(unit);
  });

  it('should return an empty object as the unit if unit with the given id is not fetched', () => {
    const resource = Resource.build();
    const state = getState([resource], [], resource.id);
    const selected = reservationPageSelector(state);

    expect(selected.unit).to.deep.equal({});
  });

  it('should return an empty object as the unit if resource is not fetched', () => {
    const state = getState([], [], 'unfetched-id');
    const selected = reservationPageSelector(state);

    expect(selected.unit).to.deep.equal({});
  });
});
