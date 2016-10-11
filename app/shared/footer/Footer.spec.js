import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import FooterContent from './FooterContent';
import Footer from './Footer';

describe('shared/footer/Footer', () => {
  function getWrapper() {
    return shallow(<Footer />);
  }

  it('renders a footer element', () => {
    const footer = getWrapper().find('footer');
    expect(footer.length).to.equal(1);
  });

  it('renders FooterContent component', () => {
    const footerContent = getWrapper().find(FooterContent);
    expect(footerContent.length).to.equal(1);
  });
});
