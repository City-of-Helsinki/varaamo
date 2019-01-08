import { expect } from 'chai';
import moment from 'moment';

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

  it('returns filteredResourceTypes', () => {
    expect(getSelected().filteredResourceTypes).to.exist;
  });

  it('returns resourceTypes', () => {
    expect(getSelected().resourceTypes).to.exist;
  });

  it('returns date', () => {
    const selected = getSelected({ 'ui.pages.adminResources': { date: '2017-02-01' } });
    expect(selected.date).to.equal('2017-02-01');
  });

  it('returns current date by default', () => {
    const current = moment().format('YYYY-MM-DD');
    expect(getSelected().date).to.equal(current);
  });

  it('returns an array of resource ids ordered by translated name', () => {
    const resource1 = { id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' } };
    const resource2 = { id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' } };
    const resource3 = { id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' } };
    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
      },
      'intl.locale': 'fi',
      'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
    };
    const expected = [3, 1];
    const selected = getSelected(extraState);
    expect(selected.resources).to.deep.equal(expected);
  });

  it('returns an array of resourceTypes', () => {
    const resource1 = { id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' } };
    const resource2 = { id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' } };
    const resource3 = { id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' } };
    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
      },
      'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
    };
    const expected = ['school', 'printer'];
    const selected = getSelected(extraState);
    expect(selected.resourceTypes).to.deep.equal(expected);
  });

  it('returns an array of filteredResourceTypes and filtered resourceIds', () => {
    const resource1 = { id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' } };
    const resource2 = { id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' } };
    const resource3 = { id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' } };
    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
      },
      'ui.pages.adminResources.filteredResourceTypes': ['school'],
      'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
    };
    const selected = getSelected(extraState);
    expect(selected.filteredResourceTypes).to.deep.equal(['school']);
    expect(selected.resources).to.deep.equal([1]);
  });
});
