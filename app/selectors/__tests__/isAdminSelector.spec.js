import indexBy from 'lodash/collection/indexBy';
import { expect } from 'chai';

import isAdminSelector from 'selectors/isAdminSelector';
import Resource from 'fixtures/Resource';

function getState(resources = []) {
  return {
    data: {
      resources: indexBy(resources, 'id'),
    },
  };
}

describe('Selector: isAdminSelector', () => {
  it('should return false if there are no Resources in state', () => {
    const state = getState();
    const actual = isAdminSelector(state);

    expect(actual).to.equal(false);
  });

  it('should return false user is not an admin in any Resource', () => {
    const resources = [
      Resource.build({ userPermissions: { isAdmin: false } }),
      Resource.build({ userPermissions: { isAdmin: false } }),
    ];
    const state = getState(resources);
    const actual = isAdminSelector(state);

    expect(actual).to.equal(false);
  });

  it('should return true if user is an admin in any Resource', () => {
    const resources = [
      Resource.build({ userPermissions: { isAdmin: false } }),
      Resource.build({ userPermissions: { isAdmin: true } }),
    ];
    const state = getState(resources);
    const actual = isAdminSelector(state);

    expect(actual).to.equal(true);
  });
});
