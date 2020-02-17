import toJSON from 'enzyme-to-json';
import React from 'react';

import SearchMapToggle from '../SearchMapToggle';
import { shallowWithIntl } from '../../../../../app/utils/testUtils';

const findListButton = wrapper => wrapper.find({ children: 'MapToggle.showList' });
const findMapButton = wrapper => wrapper.find({ children: 'MapToggle.showMap' });
const getButtonClass = modifier => `app-SearchMapToggle__button${modifier && `--${modifier}`}`;
const findButtons = wrapper => wrapper.find(getButtonClass());

describe('SearchMapToggle', () => {
  const defaultProps = {
    onClick: () => {},
    resultCount: 50,
    active: 'list',
  };
  const getWrapper = props => shallowWithIntl(<SearchMapToggle {...defaultProps} {...props} />);

  test('renders correctly', () => {
    const wrapper = getWrapper({
      active: 'list',
      onClick: () => null,
      resultCount: 53,
    });

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('onClick', () => {
    const onClick = jest.fn();
    const wrapper = getWrapper({
      active: 'list',
      onClick,
      resultCount: 53,
    });

    wrapper.find('.app-SearchMapToggle__button-map').simulate('click');

    expect(onClick.mock.calls[0][0]).toBe('map');
  });

  describe('buttons', () => {
    const expectButtonToBeActive = (button, not = true) => {
      expect(button.prop('aria-selected')).toBe(not);
      expect(button.hasClass(getButtonClass('selected'))).toBe(not);
    };
    expectButtonToBeActive.not = button => expectButtonToBeActive(button, false);

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
});
