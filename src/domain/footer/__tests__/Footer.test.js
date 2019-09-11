import React from 'react';
import toJSON from 'enzyme-to-json';
import simple from 'simple-mock';

import { shallowWithIntl } from '../../../../app/utils/testUtils';
import FeedbackLink from '../../../../app/shared/feedback-link/FeedbackLink';
import * as customizationUtils from '../../../../app/utils/customizationUtils';
import Footer from '../Footer';

describe('domain/footer/Footer', () => {
  function getWrapper(props) {
    return shallowWithIntl(<Footer {...props} />);
  }

  test('renders a footer element', () => {
    const footer = getWrapper().find('footer');
    expect(footer.length).toBe(1);
  });
  test('renders correctly', () => {
    const wrapper = shallowWithIntl(
      <Footer />
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  describe('When there is no customization in use', () => {
    let content;

    beforeAll(() => {
      content = getWrapper();
    });

    test('contains feedback link', () => {
      const feedbackLink = content.find(FeedbackLink);
      expect(feedbackLink.length).toBe(1);
    });

    test('renders correctly', () => {
      const wrapper = shallowWithIntl(
        <Footer />
      );
      expect(toJSON(wrapper)).toMatchSnapshot();
    });

    it('renders texts for default (Helsinki)', () => {
      expect(content.find({ id: 'Footer.helsinkiText' }).length).toBe(1);
    });
  });

  describe('When Espoo customization is used', () => {
    let content;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      content = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('contains feedback link', () => {
      const feedbackLink = content.find(FeedbackLink);
      expect(feedbackLink.length).toBe(1);
    });

    it('renders texts for Espoo', () => {
      expect(content.find({ id: 'Footer.espooText' }).length).toBe(1);
    });
  });

  describe('When Vantaa customization is used', () => {
    let content;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('VANTAA');
      content = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('contains feedback link', () => {
      const feedbackLink = content.find(FeedbackLink);
      expect(feedbackLink.length).toBe(1);
    });
  });
});
