import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import DateHeader from 'components/common/DateHeader';

describe('Component: common/DateHeader', () => {
  const props = {
    date: '2015-10-11',
    onChange: simple.stub(),
  };

  const tree = sd.shallowRender(<DateHeader {...props} />);

  describe('header', () => {
    const h3Trees = tree.everySubTree('h3');

    it('should render a h3 header', () => {
      expect(h3Trees.length).to.equal(1);
    });

    it('should display the weekday of the given date', () => {
      const weekDay = 'Sunnuntai';

      expect(h3Trees[0].text()).to.contain(weekDay);
    });

    it('should display the date in humanized format', () => {
      const humanizedDate = '11. lokakuuta 2015';

      expect(h3Trees[0].text()).to.contain(humanizedDate);
    });

    describe('icon buttons', () => {
      const buttonTrees = tree.everySubTree('button');

      it('render 2 buttons for changing the date', () => {
        expect(buttonTrees.length).to.equal(2);
      });

      it('both buttons should have a glypicon inside them', () => {
        buttonTrees.forEach(buttonTree => {
          expect(buttonTree.everySubTree('Glyphicon').length).to.equal(1);
        });
      });

      it('clicking the first button should decrement the date by one', () => {
        const buttonVdom = buttonTrees[0].getRenderOutput();
        props.onChange.reset();
        buttonVdom.props.onClick();

        expect(props.onChange.callCount).to.equal(1);
        expect(props.onChange.lastCall.args[0]).to.equal('2015-10-10');
      });

      it('clicking the second button should increment the date by one', () => {
        const buttonVdom = buttonTrees[1].getRenderOutput();
        props.onChange.reset();
        buttonVdom.props.onClick();

        expect(props.onChange.callCount).to.equal(1);
        expect(props.onChange.lastCall.args[0]).to.equal('2015-10-12');
      });
    });
  });
});
