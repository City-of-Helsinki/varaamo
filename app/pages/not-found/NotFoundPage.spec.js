import React from 'react';

import PageWrapper from '../PageWrapper';
import { shallowWithIntl } from '../../utils/testUtils';
import NotFoundPage from './NotFoundPage';

describe('pages/not-found/NotFoundPage', () => {
  function getWrapper() {
    return shallowWithIntl(<NotFoundPage />);
  }

  test('renders PageWrapper with correct title', () => {
    const pageWrapper = getWrapper().find(PageWrapper);
    expect(pageWrapper).toHaveLength(1);
    expect(pageWrapper.prop('title')).toBe('NotFoundPage.title');
  });

  test('renders correct title inside h1 tags', () => {
    const h1 = getWrapper().find('h1');
    expect(h1.props().children).toBe('NotFoundPage.title');
  });

  test('renders a list and list elements for displaying help to user', () => {
    const ul = getWrapper().find('ul');
    const lis = getWrapper().find('li');
    expect(ul.length).toBe(1);
    expect(lis.length).toBe(3);
  });
});
