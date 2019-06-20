/**
 * Builds search string from an object.
 * @param search {object}
 * @returns {string}
 */
export const getSearch = (search) => {
  return new URLSearchParams(search).toString();
};

/**
 * Getter for link string with given path and query params.
 * @param path {string}
 * @param search {object}
 * @returns {string}
 */
export const getLinkString = (path, search) => {
  let searchString = '';

  if (search) {
    searchString = getSearch(search);
  }

  return `${path}${search ? `?${searchString}` : ''}`;
};
