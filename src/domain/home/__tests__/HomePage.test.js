import React from 'react';
import simple from 'simple-mock';
import Link from 'react-router-dom/Link';
import toJson from 'enzyme-to-json';

import HomePage from '../HomePage';
import { shallowWithIntl } from '../../../../app/utils/testUtils';

describe('pages/home/HomePage', () => {
  const history = {
    push: () => {},
  };

  const defaultProps = {
    history,
    isFetchingPurposes: false,
    locale: 'en',
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<HomePage {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    describe('Purpose banners', () => {
      let wrapper;

      beforeAll(() => {
        wrapper = getWrapper();
      });

      afterAll(() => {
        simple.restore();
      });

      test('render normally', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
      });

      test(' have at least a Link component', () => {
        wrapper.setState({
          purposes: [
            {
              id: 'purpose-foo',
              name: {
                en: 'purpose-name',
              },
            },
          ],
        });

        wrapper.update();
        expect(wrapper.find(Link).first().prop('to')).toContain('purpose-foo');
      });
    });
  });

  describe('handleSearch', () => {
    const value = 'some value';
    const expectedPath = `/search?search=${value}`;
    let historyMock;

    beforeAll(() => {
      const instance = getWrapper().instance();
      historyMock = simple.mock(history, 'push');
      instance.handleSearch(value);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls browserHistory push with correct path', () => {
      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([expectedPath]);
    });
  });
});
