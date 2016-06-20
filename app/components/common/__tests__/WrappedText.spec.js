import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import WrappedText from 'components/common/WrappedText';
import AutoLinkText from 'react-autolink-text';

describe('Component: common/WrappedText', () => {
  const defaultProps = {
    text: 'Some text',
  };

  function getWrapper(extraProps) {
    return shallow(<WrappedText {...defaultProps} {...extraProps} />);
  }

  it('should have class "wrapped-text"', () => {
    const wrapper = getWrapper();
    expect(wrapper.hasClass('wrapped-text')).to.be.true;
  });

  describe('Text with one line', () => {
    const text = 'Just one line';
    let content;

    before(() => {
      content = getWrapper({ text }).children();
    });

    it('should render a div for the text', () => {
      const div = content.find('div');
      expect(div.length).to.equal(1);
    });

    it('should use autolink for the text', () => {
      const autolink = content.find(AutoLinkText);
      expect(autolink.length).to.equal(1);
      expect(autolink.props().text).to.equal(text);
    });
  });

  describe('Text with multiple lines', () => {
    const lines = ['First line', 'Second line', 'Third line'];
    const text = lines.join('\n');
    let content;

    before(() => {
      content = getWrapper({ text }).children();
    });

    it('should render a div for each line', () => {
      const div = content.find('div');
      expect(div.length).to.equal(lines.length);
    });

    it('should use autolink for each line', () => {
      const autolinks = content.find(AutoLinkText);
      expect(autolinks.length).to.equal(lines.length);
      lines.forEach((line, index) => {
        expect(autolinks.at(index).props().text).to.equal(line);
      });
    });
  });
});
