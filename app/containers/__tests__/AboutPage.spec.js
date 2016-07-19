import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import AboutPageContent from 'components/customization/AboutPageContent';
import AboutPage from 'containers/AboutPage';

describe('Container: AboutPage', () => {
  function getWrapper() {
    return shallow(<AboutPage />);
  }

  it('should render AboutPageContent component', () => {
    expect(getWrapper().find(AboutPageContent).length).to.equal(1);
  });
});
