import toJSON from 'enzyme-to-json';
import React from 'react';

import SearchMapToggle from '../SearchMapToggle';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';

const findListButton = (wrapper) =>
  wrapper.find({ children: 'MapToggle.showList' });
const findMapButton = (wrapper) =>
  wrapper.find({ children: 'MapToggle.showMap' });
const getButtonClass = (modifier) =>
  `app-SearchMapToggle__button${modifier && `--${modifier}`}`;
const findButtons = (wrapper) => wrapper.find(getButtonClass());
const findResultCount = (wrapper) =>
  wrapper.find('[data-testid="result-count"]');

describe('SearchMapToggle', () => {
  const defaultProps = {
    onClick: () => {},
    resultCount: 50,
    active: 'list',
    t: (path) => path,
  };
  const getWrapper = (props) =>
    shallowWithIntl(<SearchMapToggle {...defaultProps} {...props} />);

  test('renders correctly', () => {
    const wrapper = getWrapper();

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('onClick', () => {
    const onClick = jest.fn();
    const wrapper = getWrapper({ onClick });

    wrapper.find('.app-SearchMapToggle__button-map').simulate('click');

    expect(onClick.mock.calls[0][0]).toBe('map');
  });

  describe('buttons', () => {
    const expectButtonToBeActive = (button, not = true) => {
      expect(button.prop('aria-selected')).toBe(not);
      expect(button.hasClass(getButtonClass('selected'))).toBe(not);
    };
    expectButtonToBeActive.not = (button) =>
      expectButtonToBeActive(button, false);

    test('buttons have accessibility props', () => {
      const buttons = findButtons(getWrapper());

      buttons.forEach((button) => {
        expect(button.prop('role')).toEqual('tab');
        expect(button.prop('aria-selected')).toBeDefined();
      });
    });

    test('only renders list button as selected if list is active', () => {
      const wrapper = getWrapper({ active: 'list' });

      expectButtonToBeActive(findListButton(wrapper));
      expectButtonToBeActive.not(findMapButton(wrapper));
    });

    test('only renders map button as selected if map is active', () => {
      const wrapper = getWrapper({ active: 'map' });

      expectButtonToBeActive(findMapButton(wrapper));
      expectButtonToBeActive.not(findListButton(wrapper));
    });
  });

  test('result count should be announced', () => {
    expect(findResultCount(getWrapper()).prop('role')).toEqual('status');
  });
});
