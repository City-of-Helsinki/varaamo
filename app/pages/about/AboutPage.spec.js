import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import AboutPage from './AboutPage';
import AboutPageContent from './AboutPageContent';

describe('pages/about/AboutPage', () => {
  function getWrapper() {
    return shallow(<AboutPage />);
  }

  it('renders AboutPageContent component', () => {
    expect(getWrapper().find(AboutPageContent).length).to.equal(1);
  });
});
