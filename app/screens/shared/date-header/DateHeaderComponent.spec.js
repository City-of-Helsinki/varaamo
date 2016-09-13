import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import DateHeaderComponent from './DateHeaderComponent';

describe('screens/shared/date-header/DateHeaderComponent', () => {
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

    describe('icon buttons', () => {
      describe('when onChange function is given in props', () => {
        const extraProps = {
          onChange: simple.stub(),
        };
        let buttons;

        before(() => {
          buttons = getWrapper(extraProps).find('button');
        });

        it('renders 2 buttons for changing the date', () => {
          expect(buttons.length).to.equal(2);
        });

        it('clicking the first button should decrement the date by one', () => {
          extraProps.onChange.reset();
          buttons.at(0).props().onClick();

          expect(extraProps.onChange.callCount).to.equal(1);
          expect(extraProps.onChange.lastCall.args[0]).to.equal('2015-10-10');
        });

        it('clicking the second button should increment the date by one', () => {
          extraProps.onChange.reset();
          buttons.at(1).props().onClick();

          expect(extraProps.onChange.callCount).to.equal(1);
          expect(extraProps.onChange.lastCall.args[0]).to.equal('2015-10-12');
        });
      });

      describe('when onChange function is not given in props', () => {
        const extraProps = {
          onChange: undefined,
        };
        let buttons;

        before(() => {
          buttons = getWrapper(extraProps).find('button');
        });

        it('does not render any buttons', () => {
          expect(buttons.length).to.equal(0);
        });
      });
    });
  });
});
