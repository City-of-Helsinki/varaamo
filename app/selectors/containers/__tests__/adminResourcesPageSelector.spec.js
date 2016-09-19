import { expect } from 'chai';

import Resource from 'fixtures/Resource';
import adminResourcesPageSelector from 'selectors/containers/adminResourcesPageSelector';
import { getDefaultRouterProps, getInitialState, getState } from 'utils/TestUtils';

describe('Selector: adminResourcesPageSelector', () => {
  const state = getInitialState();
  const props = getDefaultRouterProps();
  const selected = adminResourcesPageSelector(state, props);

  it('should return isAdmin', () => {
    expect(selected.isAdmin).to.exist;
  });

  it('should return isFetchingResources', () => {
    expect(selected.isFetchingResources).to.exist;
  });

  it('should return resources', () => {
    expect(selected.resources).to.exist;
  });

  it('should return an array of resources', () => {
    const resource1 = Resource.build();
    const resource2 = Resource.build();
    const resource3 = Resource.build();
    const customState = getState({
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
      },
      'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
    });
    const customSelected = adminResourcesPageSelector(customState, props);
    expect(customSelected.resources).to.deep.equal([resource1, resource3]);
  });
});
