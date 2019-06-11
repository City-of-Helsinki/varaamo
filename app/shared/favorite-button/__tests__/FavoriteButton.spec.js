import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';

import { shallowWithIntl } from '../../../utils/testUtils';
import FavoriteButton from '../FavoriteButton';

describe('shared/favorite-button/FavoriteButton', () => {
  const defaultProps = {
    favorited: true,
    onClick: simple.mock(),
  };

  function getWrapper(props) {
    return shallowWithIntl(<FavoriteButton {...defaultProps} {...props} />);
  }
  let wrapper;

  beforeAll(() => {
    wrapper = getWrapper();
  });

  test('is a Button', () => {
    expect(wrapper.is(Button)).toBe(true);
  });

  test('has favorite-button class name', () => {
    expect(getWrapper({ favorited: false }).prop('className')).toBe('favorite-button');
  });

  test('has favorite class modifier if it is favorited', () => {
    expect(getWrapper({ favorited: true }).prop('className')).toBe('favorite-button favorite-button--favorite');
  });

  test('passes onClick prop', () => {
    expect(wrapper.prop('onClick')).toEqual(defaultProps.onClick);
  });

  test('has remove favorite text if favorited', () => {
    const buttonText = getWrapper({ favorited: true }).find('span');
    expect(buttonText).toHaveLength(1);
    expect(buttonText.text()).toBe('ResourceHeader.favoriteRemoveButton');
  });

  test('has add favorite text if not favorited', () => {
    const buttonText = getWrapper({ favorited: false }).find('span');
    expect(buttonText).toHaveLength(1);
    expect(buttonText.text()).toBe('ResourceHeader.favoriteAddButton');
  });
});
