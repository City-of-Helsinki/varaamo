import { shallow } from 'enzyme';
import React from 'react';

import FooterContent from './FooterContent';
import Footer from './Footer';

describe('shared/footer/Footer', () => {
  function getWrapper(props) {
    return shallow(<Footer {...props} />);
  }

  test('renders a footer element', () => {
    const footer = getWrapper().find('footer');
    expect(footer.length).toBe(1);
  });

  test('renders FooterContent component', () => {
    const footerContent = getWrapper().find(FooterContent);
    expect(footerContent.length).toBe(1);
  });

  test('passes onLinkClick prop to FooterContent', () => {
    const onLinkClick = () => {};
    const footerContent = getWrapper({ onLinkClick }).find(FooterContent);
    expect(footerContent.prop('onLinkClick')).toBe(onLinkClick);
  });
});
