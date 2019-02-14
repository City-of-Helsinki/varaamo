import types from 'constants/ActionTypes';

import { expect } from 'chai';
import { favoriteResource, unfavoriteResource } from 'actions/resourceActions';
import { buildAPIUrl } from 'utils/apiUtils';
import { createApiTest } from 'utils/testUtils';

describe('Actions: resourceActions', () => {
  describe('favoriteResource', () => {
    const resourceId = '123';

    createApiTest({
      name: 'favorite',
      action: favoriteResource,
      args: [resourceId],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl(`resource/${resourceId}/favorite`),
        request: {
          type: types.API.RESOURCE_FAVORITE_POST_REQUEST
        },
        success: {
          type: types.API.RESOURCE_FAVORITE_POST_SUCCESS,
          extra: {
            tests: {
              'contains resource id in meta': ({ meta }) => {
                expect(meta.id).to.equal(resourceId);
              }
            }
          }
        },
        error: {
          type: types.API.RESOURCE_FAVORITE_POST_ERROR
        }
      }
    });
  });

  describe('unfavoriteResource', () => {
    const resourceId = '123';

    createApiTest({
      name: 'unfavorite',
      action: unfavoriteResource,
      args: [resourceId],
      tests: {
        method: 'POST',
        endpoint: buildAPIUrl(`resource/${resourceId}/unfavorite`),
        request: {
          type: types.API.RESOURCE_UNFAVORITE_POST_REQUEST
        },
        success: {
          type: types.API.RESOURCE_UNFAVORITE_POST_SUCCESS,
          extra: {
            tests: {
              'contains resource id in meta': ({ meta }) => {
                expect(meta.id).to.equal(resourceId);
              }
            }
          }
        },
        error: {
          type: types.API.RESOURCE_UNFAVORITE_POST_ERROR
        }
      }
    });
  });
});
