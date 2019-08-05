import round from 'lodash/round';

import * as urlUtils from '../../common/url/utils';
import * as dataUtils from '../../common/data/utils';

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

/**
 * Getter for formatted unit address string.
 * @param unit
 * @param locale
 * @returns {string}
 */
export const getUnitAddress = (unit, locale) => {
  let postal;
  const streetAddress = dataUtils.getLocalizedFieldValue(unit.street_address, locale);
  if (unit && unit.address_zip) {
    postal = unit.address_zip;
  }
  if (unit && unit.municipality) {
    postal = postal ? `${postal} ${unit.municipality}` : unit.municipality;
  }

  return `${streetAddress}${postal ? ` ${postal}` : ''}`;
};

/**
 * Getter for formatted resource distance string.
 * @param resource
 * @returns {string}
 */
export const getResourceDistance = (resource) => {
  const km = resource.distance / 1000;
  return km ? `${round(km, km < 10 ? 1 : null)} km` : '';
};

/**
 * Getter for price string used in resource cards.
 * @param resource
 * @param t
 * @returns {string|*}
 */
export const getPrice = (resource, t) => {
  const minPricePerHour = resource.min_price_per_hour;
  const maxPricePerHour = resource.max_price_per_hour;

  if (!(minPricePerHour || maxPricePerHour)) {
    return t('ResourceIcons.free');
  }

  if (minPricePerHour && maxPricePerHour && minPricePerHour !== maxPricePerHour) {
    return `${Number(minPricePerHour)} - ${Number(maxPricePerHour)} €/h`;
  }

  const priceString = maxPricePerHour || minPricePerHour;
  const price = priceString !== 0 ? Number(priceString) : 0;
  if (price === 0) {
    return t('ResourceIcons.free');
  }

  return price ? `${price} €/h` : null;
};

export const isFree = (resource) => {
  const minPricePerHour = resource.min_price_per_hour;
  const maxPricePerHour = resource.max_price_per_hour;

  if (!(minPricePerHour || maxPricePerHour)) {
    return true;
  }

  if (minPricePerHour && maxPricePerHour && minPricePerHour !== maxPricePerHour) {
    return false;
  }

  const priceString = maxPricePerHour || minPricePerHour;
  const price = priceString !== 0 ? Number(priceString) : 0;

  return price === 0;
};
