import { shallow } from 'enzyme';
import React from 'react';
import Linkify from 'react-linkify';

import WrappedText from '../WrappedText';

describe('shared/wrapped-text/WrappedText', () => {
  const defaultProps = {
    text: 'Some text',
  };

  function getWrapper(extraProps) {
    return shallow(<WrappedText {...defaultProps} {...extraProps} />);
  }

  test('has class "wrapped-text"', () => {
    const wrapper = getWrapper();
    expect(wrapper.hasClass('wrapped-text')).toBe(true);
  });

  test('renders an empty div if no text is given in props', () => {
    const text = undefined;
    const wrapper = getWrapper({ text });
    expect(wrapper.matchesElement(<div />)).toBe(true);
  });

  test('renders an empty div if empty string is given as text in props', () => {
    const text = '';
    const wrapper = getWrapper({ text });
    expect(wrapper.matchesElement(<div />)).toBe(true);
  });

  describe('Text with one line', () => {
    const text = 'Just one line';
    let content;

    beforeAll(() => {
      content = getWrapper({ text }).children();
    });

    test('renders a div for the text', () => {
      const div = content.find('div');
      expect(div.length).toBe(1);
    });

    test('uses Linkify to autolink the text', () => {
      const linkify = content.find(Linkify);
      expect(linkify.length).toBe(1);
      expect(linkify.props().children).toBe(text);
    });
  });

  describe('Text with multiple lines', () => {
    const lines = ['First line', 'Second line', 'Third line'];
    const text = lines.join('\n');
    let content;

    beforeAll(() => {
      content = getWrapper({ text }).children();
    });

    test('renders a div for each line', () => {
      const div = content.find('div');
      expect(div.length).toBe(lines.length);
    });

    test('uses Linkify to autolink each line', () => {
      const linkifies = content.find(Linkify);
      expect(linkifies.length).toBe(lines.length);
      lines.forEach((line, index) => {
        expect(linkifies.at(index).props().children).toBe(line);
      });
    });
  });

  describe('Opening links in new tabs', () => {
    const text = 'Text and http://example.com/ and more text';
    let content;

    test('is not enabled by default', () => {
      content = getWrapper({ text }).children();
      const linkify = content.find(Linkify);
      expect(linkify.length).toBe(1);
      expect(linkify.props().properties.target).toBeUndefined();
    });

    test('opens links in new tabs', () => {
      content = getWrapper({ text, openLinksInNewTab: true }).children();
      const linkify = content.find(Linkify);
      expect(linkify.length).toBe(1);
      expect(linkify.props().properties.target).toBe('_blank');
      expect(linkify.props().properties.rel).toBe('noopener noreferrer');
    });
  });
});
