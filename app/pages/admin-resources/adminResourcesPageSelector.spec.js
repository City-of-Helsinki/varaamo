import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import adminResourcesPageSelector from './adminResourcesPageSelector';

describe('pages/admin-resources/adminResourcesPageSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return adminResourcesPageSelector(state);
  }

  it('returns isAdmin', () => {
    expect(getSelected().isAdmin).to.exist;
  });

  it('returns isFetchingResources', () => {
    expect(getSelected().isFetchingResources).to.exist;
  });

  it('returns resources', () => {
    expect(getSelected().resources).to.exist;
  });

  it('returns an array of resources translated and ordered by name', () => {
    const resource1 = { id: 1, name: { fi: 'Tatooine' } };
    const resource2 = { id: 2, name: { fi: 'Dantooine' } };
    const resource3 = { id: 3, name: { fi: 'Alderaan' } };
    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
      },
      'intl.locale': 'fi',
      'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
    };
    const expected = [
      { id: 3, name: 'Alderaan' },
      { id: 1, name: 'Tatooine' },
    ];
    const selected = getSelected(extraState);
    expect(selected.resources).to.deep.equal(expected);
  });
});
