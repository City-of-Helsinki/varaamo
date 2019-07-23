import get from 'lodash/get';
import range from 'lodash/range';
import capitalize from 'lodash/capitalize';
import sortBy from 'lodash/sortBy';
import snakeCase from 'lodash/snakeCase';
import forEach from 'lodash/forEach';

import constants from '../../../app/constants/AppConstants';
import * as urlUtils from '../../common/url/utils';

export const getFiltersFromUrl = (location) => {
  const query = new URLSearchParams(location.search);
  const filters = {};

  query.forEach((value, key) => {
    if (constants.SUPPORTED_SEARCH_FILTERS[key] !== undefined) {
      filters[key] = value;
    }
  });

  return filters;
};

export const getSearchFromFilters = (filters) => {
  return urlUtils.getSearch(filters);
};

export const getApiParamsFromFilters = (filters) => {
  const params = {};
  forEach(filters, (value, key) => {
    params[snakeCase(key)] = value;
  });

  return params;
};

export const getUnitOptions = (units, locale) => {
  const options = units.map(unit => ({
    value: unit.id,
    label: get(unit, `name[${locale}]`, ''),
  }));

  return sortBy(options, 'label');
};

export const getPurposeOptions = (purposes, locale) => {
  const options = purposes
    .filter(purpose => purpose.parent === null)
    .map(unit => ({
      value: unit.id,
      label: get(unit, `name[${locale}]`, ''),
    }));

  return sortBy(options, 'label');
};

/**
 * Getter for people capacity options.
 * @returns {{label: number, value: number}[]}
 */
export const getPeopleCapacityOptions = () => {
  return [
    ...range(1, 10),
    ...range(10, 35, 5),
    ...range(40, 110, 10),
  ].map(number => ({ label: number, value: number }));
};

/**
 * Getter for municipality options.
 * @returns {{label: string, value: string}[]}
 */
export const getMunicipalityOptions = () => {
  let municipalities = constants.DEFAULT_MUNICIPALITY_OPTIONS;

  if (Array.isArray(SETTINGS.CUSTOM_MUNICIPALITY_OPTIONS)
    && SETTINGS.CUSTOM_MUNICIPALITY_OPTIONS.length) {
    municipalities = SETTINGS.CUSTOM_MUNICIPALITY_OPTIONS;
  }

  return municipalities.map((municipality) => {
    const municipalityStr = typeof municipality === 'string' ? municipality : municipality.toString();

    return {
      value: municipalityStr.toLowerCase(),
      label: capitalize(municipalityStr),
    };
  });
};

/**
 * Getter for search page url.
 * Just give it the filters and it returns you the search page path.
 * @param filters {object}
 * @returns {string}
 */
export const getSearchPageLink = (filters) => {
  return urlUtils.getLinkString('/new-search', getSearchFromFilters(filters));
};
