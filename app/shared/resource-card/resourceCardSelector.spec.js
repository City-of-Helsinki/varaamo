import Resource from '../../utils/fixtures/Resource';
import Unit from '../../utils/fixtures/Unit';
import { getState } from '../../utils/testUtils';
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

  test('returns isLoggedIn', () => {
    expect(getSelected().isLoggedIn).toBeDefined();
  });

  test('returns correct resource from state', () => {
    expect(getSelected().resource).toEqual(resource);
  });

  test('returns correct unit from state', () => {
    expect(getSelected().unit).toEqual(unit);
  });
});
