import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import {
  purposesSelector,
  reservationsSelector,
  resourcesSelector,
  unitsSelector,
} from './dataSelectors';

describe('state/selectors/dataSelectors', () => {
  describe('purposesSelector', () => {
    it('returns purposes translated in current language from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.purposes': {
          1: { id: 1, name: { en: 'Meetings' } },
          2: { id: 2, name: { en: 'Gaming' } },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, name: 'Meetings' },
        2: { id: 2, name: 'Gaming' },
      };
      const selected = purposesSelector(state);
      expect(selected).to.deep.equal(expected);
    });
  });

  describe('reservationsSelector', () => {
    it('returns reservations from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.reservations': {
          1: { id: 1, foo: 'bar' },
          2: { id: 2, foo: 'bar' },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, foo: 'bar' },
        2: { id: 2, foo: 'bar' },
      };
      const selected = reservationsSelector(state);
      expect(selected).to.deep.equal(expected);
    });
  });

  describe('resourcesSelector', () => {
    it('returns resources translated in current language from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.resources': {
          1: { id: 1, name: { en: 'Meetings' } },
          2: { id: 2, name: { en: 'Gaming' } },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, name: 'Meetings' },
        2: { id: 2, name: 'Gaming' },
      };
      const selected = resourcesSelector(state);
      expect(selected).to.deep.equal(expected);
    });
  });

  describe('unitsSelector', () => {
    it('returns units translated in current language from the state', () => {
      const locale = 'en';
      const state = getState({
        'data.units': {
          1: { id: 1, name: { en: 'Meetings' } },
          2: { id: 2, name: { en: 'Gaming' } },
        },
        intl: { locale },
      });
      const expected = {
        1: { id: 1, name: 'Meetings' },
        2: { id: 2, name: 'Gaming' },
      };
      const selected = unitsSelector(state);
      expect(selected).to.deep.equal(expected);
    });
  });
});
