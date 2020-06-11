import React from 'react';
import toJSON from 'enzyme-to-json';

import { UntranslatedSearchSort as SearchSort } from '../SearchSort';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';

const findAccessibilitySortOrderAnnouncer = (wrapper) =>
  wrapper.find('[data-testid="sort-order-announcer"]');

describe('SearchSort', () => {
  const defaultProps = {
    locale: 'en',
    onChange: () => null,
    t: jest.fn((path) => path),
  };
  const getWrapper = (props) =>
    shallowWithIntl(<SearchSort {...defaultProps} {...props} />);

  test('renders correctly', () => {
    const wrapper = getWrapper();

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  describe('accessibility sort order announcer', () => {
    test('should be rendered', () => {
      expect(findAccessibilitySortOrderAnnouncer(getWrapper()).length).toEqual(
        1
      );
    });

    test('should be hidden from visual UI', () => {
      expect(
        findAccessibilitySortOrderAnnouncer(getWrapper()).hasClass('sr-only')
      ).toEqual(true);
    });

    test('should be announced', () => {
      expect(
        findAccessibilitySortOrderAnnouncer(getWrapper()).prop('role')
      ).toEqual('status');
    });

    test('should have expected content', () => {
      const locale = 'en';
      const value = `unit_name_${locale}`;
      const accessibilityShortcuts = findAccessibilitySortOrderAnnouncer(
        getWrapper({ locale, value })
      );

      expect(accessibilityShortcuts.prop('children'))
        // eslint-disable-next-line no-useless-concat
        .toEqual('SearchSort.sortingStyle' + 'SearchSort.premiseLabel');
    });
  });
});
