import * as urlUtils from '../../common/url/utils';

/**
 * Getter for resource page link.
 * Returns a resource page url with the given query params.
 * @param resource
 * @param query
 * @returns {string}
 */
export const getResourcePageLink = (resource, query) => {
  return urlUtils.getLinkString(`/resources/${resource.id}`, query);
};
