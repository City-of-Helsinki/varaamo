import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import FooterContent from './FooterContent';
import Footer from './Footer';

describe('shared/footer/Footer', () => {
  function getWrapper(props) {
    return shallow(<Footer {...props} />);
  }

  it('renders a footer element', () => {
    const footer = getWrapper().find('footer');
    expect(footer.length).to.equal(1);
  });

  it('renders FooterContent component', () => {
    const footerContent = getWrapper().find(FooterContent);
    expect(footerContent.length).to.equal(1);
  });

  it('passes onLinkClick prop to FooterContent', () => {
    const onLinkClick = () => {};
    const footerContent = getWrapper({ onLinkClick }).find(FooterContent);
    expect(footerContent.prop('onLinkClick')).to.equal(onLinkClick);
  });
});
