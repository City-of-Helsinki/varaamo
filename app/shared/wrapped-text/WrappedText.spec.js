import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Linkify from 'react-linkify';

import WrappedText from './WrappedText';

describe('shared/wrapped-text/WrappedText', () => {
  const defaultProps = {
    text: 'Some text',
  };

  function getWrapper(extraProps) {
    return shallow(<WrappedText {...defaultProps} {...extraProps} />);
  }

  it('has class "wrapped-text"', () => {
    const wrapper = getWrapper();
    expect(wrapper.hasClass('wrapped-text')).to.be.true;
  });

  it('renders an empty div if no text is given in props', () => {
    const text = undefined;
    const wrapper = getWrapper({ text });
    expect(wrapper.matchesElement(<div />)).to.be.true;
  });

  it('renders an empty div if empty string is given as text in props', () => {
    const text = '';
    const wrapper = getWrapper({ text });
    expect(wrapper.matchesElement(<div />)).to.be.true;
  });

  describe('Text with one line', () => {
    const text = 'Just one line';
    let content;

    before(() => {
      content = getWrapper({ text }).children();
    });

    it('renders a div for the text', () => {
      const div = content.find('div');
      expect(div.length).to.equal(1);
    });

    it('uses Linkify to autolink the text', () => {
      const linkify = content.find(Linkify);
      expect(linkify.length).to.equal(1);
      expect(linkify.props().children).to.equal(text);
    });
  });

  describe('Text with multiple lines', () => {
    const lines = ['First line', 'Second line', 'Third line'];
    const text = lines.join('\n');
    let content;

    before(() => {
      content = getWrapper({ text }).children();
    });

    it('renders a div for each line', () => {
      const div = content.find('div');
      expect(div.length).to.equal(lines.length);
    });

    it('uses Linkify to autolink each line', () => {
      const linkifies = content.find(Linkify);
      expect(linkifies.length).to.equal(lines.length);
      lines.forEach((line, index) => {
        expect(linkifies.at(index).props().children).to.equal(line);
      });
    });
  });
});
