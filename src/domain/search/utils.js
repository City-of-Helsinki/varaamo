import get from 'lodash/get';
import range from 'lodash/range';
import capitalize from 'lodash/capitalize';
import sortBy from 'lodash/sortBy';
import snakeCase from 'lodash/snakeCase';
import forEach from 'lodash/forEach';
import moment from 'moment';

import { getDefaultMunicipality } from '../../../app/utils/customizationUtils';
import constants from '../../../app/constants/AppConstants';
import * as urlUtils from '../../common/url/utils';
import settings from '../../../config/settings';

export const getFiltersFromUrl = (location, supportedFilters = constants.SUPPORTED_SEARCH_FILTERS) => {
  const query = new URLSearchParams(location.search);
  const defaultDate = moment().format(constants.DATE_FORMAT);
  const defaultMunicipality = getDefaultMunicipality();

  const filters = {
    // Give default date to populate start/end time as default when fetching resources,
    // Otherwise, reservations property under resource data will be
    // empty.
    date: defaultDate,
    // Determine current version of Varaamo (Helsinki, Espoo, Vantaa)
    // and filter results to target that municipality by default.
    municipality: defaultMunicipality,
  };

  query.forEach((value, key) => {
    if (!supportedFilters || supportedFilters[key] !== undefined) {
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
  const options = units.map((unit) => {
    const finnishName = get(unit, 'name.fi');

    return ({
      value: unit.id,
      // Use name in Finnish in case it doesn't exist for current locale
      label: get(unit, `name[${locale}]`, finnishName),
    });
  });

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

export const getClosestPeopleCapacityValue = (value) => {
  return getPeopleCapacityOptions()
    .map(option => option.value)
    .reduce((previous, current) => {
      if (Math.abs(current - value) < Math.abs(previous - value) && current - value < 1) {
        return current;
      }

      return previous;
    });
};

/**
 * Getter for municipality options.
 * @returns {{label: string, value: string}[]}
 */
export const getMunicipalityOptions = () => {
  let municipalities = constants.DEFAULT_MUNICIPALITY_OPTIONS;

  if (
    Array.isArray(settings.CUSTOM_MUNICIPALITY_OPTIONS)
    && settings.CUSTOM_MUNICIPALITY_OPTIONS.length
  ) {
    municipalities = settings.CUSTOM_MUNICIPALITY_OPTIONS;
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
  return urlUtils.getLinkString('/search', getSearchFromFilters(filters));
};
