import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';

import Footer from 'screens/layout/Footer';
import FooterContent from 'components/customization/FooterContent';

describe('Component: layout/Footer', () => {
  function getWrapper() {
    return shallow(<Footer />);
  }

  it('should render a footer element', () => {
    const footer = getWrapper().find('footer');
    expect(footer.length).to.equal(1);
  });

  it('should render FooterContent component', () => {
    const footerContent = getWrapper().find(FooterContent);
    expect(footerContent.length).to.equal(1);
  });
});
