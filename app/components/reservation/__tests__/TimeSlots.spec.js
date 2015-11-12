import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';
import simple from 'simple-mock';

import Immutable from 'seamless-immutable';

import TimeSlots from 'components/reservation/TimeSlots';
import TimeSlot from 'fixtures/TimeSlot';

describe('Component: reservation/TimeSlots', () => {
  describe('with timeslots', () => {
    const timeSlots = [
      TimeSlot.build(),
      TimeSlot.build(),
    ];
    const props = {
      isFetching: false,
      isLoggedIn: true,
      onClick: simple.stub(),
      selected: [timeSlots[0].asISOString],
      slots: Immutable(timeSlots),
    };
    let tree;

    before(() => {
      tree = sd.shallowRender(<TimeSlots {...props} />);
    });

    it('should render a Table component', () => {
      const tableTrees = tree.everySubTree('Table');

      expect(tableTrees.length).to.equal(1);
    });

    describe('rendering table headers', () => {
      let thTrees;

      before(() => {
        thTrees = tree.everySubTree('th');
      });

      it('should render 3 th elements', () => {
        expect(thTrees.length).to.equal(3);
      });

      it('first th element should be empty', () => {
        expect(thTrees[0].text()).to.equal('');
      });

      it('second th element should contain text "Aika"', () => {
        expect(thTrees[1].text()).to.equal('Aika');
      });

      it('third th element should contain text "Varaustilanne"', () => {
        expect(thTrees[2].text()).to.equal('Varaustilanne');
      });
    });

    describe('rendering individual time slots', () => {
      let timeSlotTrees;

      before(() => {
        timeSlotTrees = tree.everySubTree('TimeSlot');
      });

      it('should render a TimeSlot for every time slot in props', () => {
        expect(timeSlotTrees.length).to.equal(props.slots.length);
      });

      it('should pass correct props to TimeSlots', () => {
        timeSlotTrees.forEach((timeSlotTree, index) => {
          expect(timeSlotTree.props.isLoggedIn).to.equal(props.isLoggedIn);
          expect(timeSlotTree.props.onClick).to.equal(props.onClick);
          expect(timeSlotTree.props.slot).to.deep.equal(props.slots[index]);
        });
      });

      it('should pass correct selected as a prop to TimeSlot', () => {
        expect(timeSlotTrees[0].props.selected).to.equal(true);
        expect(timeSlotTrees[1].props.selected).to.equal(false);
      });
    });
  });

  describe('without timeslots', () => {
    const props = {
      isFetching: false,
      isLoggedIn: true,
      onClick: simple.stub(),
      selected: [],
      slots: [],
    };
    let tree;

    before(() => {
      tree = sd.shallowRender(<TimeSlots {...props} />);
    });

    it('should render a message telling the resource is not available for reservation', () => {
      const expected = 'Tila ei ole tänä päivänä avoinna.';

      expect(tree.textIn('p')).to.equal(expected);
    });
  });
});
