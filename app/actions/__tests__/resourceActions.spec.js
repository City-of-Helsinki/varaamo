import { expect } from 'chai';
import { createApiTest } from 'utils/TestUtils';

import { favoriteResource, unfavoriteResource } from 'actions/resourceActions';
import types from 'constants/ActionTypes';
import { buildAPIUrl } from 'utils/APIUtils';

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
          type: types.API.RESOURCE_FAVORITE_POST_REQUEST,
        },
        success: {
          type: types.API.RESOURCE_FAVORITE_POST_SUCCESS,
          extra: {
            tests: {
              'contains resource id in meta': ({ meta }) => {
                expect(meta.id).to.equal(resourceId);
              },
            },
          },
        },
        error: {
          type: types.API.RESOURCE_FAVORITE_POST_ERROR,
        },
      },
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
          type: types.API.RESOURCE_UNFAVORITE_POST_REQUEST,
        },
        success: {
          type: types.API.RESOURCE_UNFAVORITE_POST_SUCCESS,
          extra: {
            tests: {
              'contains resource id in meta': ({ meta }) => {
                expect(meta.id).to.equal(resourceId);
              },
            },
          },
        },
        error: {
          type: types.API.RESOURCE_UNFAVORITE_POST_ERROR,
        },
      },
    });
  });
});
