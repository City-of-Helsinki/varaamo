import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import DateHeaderComponent from './DateHeaderComponent';

describe('shared/date-header/DateHeaderComponent', () => {
  const defaultProps = {
    date: '2015-10-11',
  };

  function getWrapper(extraProps) {
    return shallow(<DateHeaderComponent {...defaultProps} {...extraProps} />);
  }

  describe('header', () => {
    it('renders a h3 header', () => {
      const header = getWrapper().find('h3');
      expect(header.length).to.equal(1);
    });

    it('displays the weekday of the given date', () => {
      const header = getWrapper().find('h3');
      const expected = 'Sunnuntai';

      expect(header.text()).to.contain(expected);
    });

    it('displays the date in humanized format', () => {
      const header = getWrapper().find('h3');
      const expected = '11. lokakuuta 2015';

      expect(header.text()).to.contain(expected);
    });

    describe('decrease date button', () => {
      describe('when onDecreaseDateButtonClick function is given in props', () => {
        const extraProps = {
          onDecreaseDateButtonClick: simple.stub(),
        };
        let button;

        before(() => {
          button = getWrapper(extraProps).find('button');
        });

        it('is rendered', () => {
          expect(button.length).to.equal(1);
        });

        it('clicking the button calls onDecreaseDateButtonClick', () => {
          extraProps.onDecreaseDateButtonClick.reset();
          button.props().onClick();

          expect(extraProps.onDecreaseDateButtonClick.callCount).to.equal(1);
        });
      });

      describe('when onDecreaseDateButtonClick function is not given in props', () => {
        const extraProps = {
          onDecreaseDateButtonClick: undefined,
        };
        let button;

        before(() => {
          button = getWrapper(extraProps).find('button');
        });

        it('does not render the button', () => {
          expect(button.length).to.equal(0);
        });
      });
    });

    describe('increase date button', () => {
      describe('when onIncreaseDateButtonClick function is given in props', () => {
        const extraProps = {
          onIncreaseDateButtonClick: simple.stub(),
        };
        let button;

        before(() => {
          button = getWrapper(extraProps).find('button');
        });

        it('is rendered', () => {
          expect(button.length).to.equal(1);
        });

        it('clicking the button calls onIncreaseDateButtonClick', () => {
          extraProps.onIncreaseDateButtonClick.reset();
          button.props().onClick();

          expect(extraProps.onIncreaseDateButtonClick.callCount).to.equal(1);
        });
      });

      describe('when onIncreaseDateButtonClick function is not given in props', () => {
        const extraProps = {
          onIncreaseDateButtonClick: undefined,
        };
        let button;

        before(() => {
          button = getWrapper(extraProps).find('button');
        });

        it('does not render the button', () => {
          expect(button.length).to.equal(0);
        });
      });
    });
  });
});
