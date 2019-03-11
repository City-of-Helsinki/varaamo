import React from 'react';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import AboutPage from './AboutPage';
import AboutPageContent from './AboutPageContent';

describe('pages/about/AboutPage', () => {
  function getWrapper() {
    return shallowWithIntl(<AboutPage />);
  }

  test('renders PageWrapper with correct props', () => {
    const pageWrapper = getWrapper().find(PageWrapper);
    expect(pageWrapper).toHaveLength(1);
    expect(pageWrapper.prop('className')).toBe('about-page');
    expect(pageWrapper.prop('title')).toBe('AboutPage.title');
  });

  test('renders AboutPageContent component', () => {
    expect(getWrapper().find(AboutPageContent).length).toBe(1);
  });
});
