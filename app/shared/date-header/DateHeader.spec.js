import moment from 'moment';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import DateHeader from './DateHeader';

describe('shared/date-header/DateHeader', () => {
  const defaultProps = {
    date: '2015-10-11',
  };

  function getWrapper(extraProps) {
    return shallow(<DateHeader {...defaultProps} {...extraProps} />);
  }

  describe('header', () => {
    test('renders a h3 header', () => {
      const header = getWrapper().find('h3');
      expect(header.length).toBe(1);
    });

    test('displays the weekday of the given date', () => {
      const header = getWrapper().find('h3');
      const expected = moment(defaultProps.date).format('dddd');
      expect(header.text().toLowerCase()).toContain(expected.toLowerCase());
    });

    test('displays the date in humanized format', () => {
      const header = getWrapper().find('h3');
      const expected = moment(defaultProps.date).format('LL');
      expect(header.text()).toContain(expected);
    });

    test('displays beforeText before date if given in props', () => {
      const beforeText = 'Some text before the date';
      const headerText = getWrapper({ beforeText }).text();
      expect(headerText.indexOf(beforeText)).toBe(0);
    });

    describe('decrease date button', () => {
      describe('when onDecreaseDateButtonClick function is given in props', () => {
        const extraProps = {
          onDecreaseDateButtonClick: simple.stub(),
        };
        let button;

        beforeAll(() => {
          button = getWrapper(extraProps).find('button');
        });

        test('is rendered', () => {
          expect(button.length).toBe(1);
        });

        test('clicking the button calls onDecreaseDateButtonClick', () => {
          extraProps.onDecreaseDateButtonClick.reset();
          button.props().onClick();

          expect(extraProps.onDecreaseDateButtonClick.callCount).toBe(1);
        });
      });

      describe('when onDecreaseDateButtonClick function is not given in props', () => {
        const extraProps = {
          onDecreaseDateButtonClick: undefined,
        };
        let button;

        beforeAll(() => {
          button = getWrapper(extraProps).find('button');
        });

        test('does not render the button', () => {
          expect(button.length).toBe(0);
        });
      });
    });

    describe('increase date button', () => {
      describe('when onIncreaseDateButtonClick function is given in props', () => {
        const extraProps = {
          onIncreaseDateButtonClick: simple.stub(),
        };
        let button;

        beforeAll(() => {
          button = getWrapper(extraProps).find('button');
        });

        test('is rendered', () => {
          expect(button.length).toBe(1);
        });

        test('clicking the button calls onIncreaseDateButtonClick', () => {
          extraProps.onIncreaseDateButtonClick.reset();
          button.props().onClick();

          expect(extraProps.onIncreaseDateButtonClick.callCount).toBe(1);
        });
      });

      describe('when onIncreaseDateButtonClick function is not given in props', () => {
        const extraProps = {
          onIncreaseDateButtonClick: undefined,
        };
        let button;

        beforeAll(() => {
          button = getWrapper(extraProps).find('button');
        });

        test('does not render the button', () => {
          expect(button.length).toBe(0);
        });
      });
    });
  });
});
