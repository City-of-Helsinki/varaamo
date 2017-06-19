import { expect } from 'chai';

import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { getState } from 'utils/testUtils';
import resourceCardSelector from './resourceCardSelector';

describe('shared/resource-list/resourceCardSelector', () => {
  const unit = Unit.build();
  const resource = Resource.build({ unit: unit.id });

  function getSelected() {
    const state = getState({
      'data.resources': { [resource.id]: resource },
      'data.units': { [unit.id]: unit },
    });
    const props = { resourceId: resource.id };
    return resourceCardSelector(state, props);
  }

  it('returns isLoggedIn', () => {
    expect(getSelected().isLoggedIn).to.exist;
  });

  it('returns correct resource from state', () => {
    expect(getSelected().resource).to.deep.equal(resource);
  });

  it('returns correct unit from state', () => {
    expect(getSelected().unit).to.deep.equal(unit);
  });
});
