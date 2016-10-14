import { expect } from 'chai';

import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { getState } from 'utils/testUtils';
import resourceListItemSelector from './resourceListItemSelector';

describe('shared/resource-list/resourceListItemSelector', () => {
  const unit = Unit.build();
  const resource = Resource.build({ unit: unit.id });
  const state = getState({
    'data.resources': { [resource.id]: resource },
    'data.units': { [unit.id]: unit },
  });
  const props = { resourceId: resource.id };
  const selected = resourceListItemSelector(state, props);

  it('returns isLoggedIn', () => {
    expect(selected.isLoggedIn).to.exist;
  });

  it('returns correct resource from state', () => {
    expect(selected.resource).to.deep.equal(resource);
  });

  it('returns correct unit from state', () => {
    expect(selected.unit).to.deep.equal(unit);
  });
});
