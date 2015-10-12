import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import TimeSlots from 'components/reservation/TimeSlots';
import TimeSlot from 'fixtures/TimeSlot';

describe('Component: reservation/TimeSlots', () => {
  describe('with timeslots', () => {
    const props = {
      isFetching: false,
      slots: Immutable([
        TimeSlot.build(),
        TimeSlot.build(),
      ]),
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

      it('should render 2 th elements', () => {
        expect(thTrees.length).to.equal(2);
      });

      it('first th element should contain text "Aika"', () => {
        expect(thTrees[0].text()).to.equal('Aika');
      });

      it('second th element should contain text "Varaustilanne"', () => {
        expect(thTrees[1].text()).to.equal('Varaustilanne');
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

      it('should pass correct props to TimeSlot', () => {
        timeSlotTrees.forEach((timeSlotTree, index) => {
          const timeSlotVdom = timeSlotTree.getRenderOutput();

          expect(timeSlotVdom.props.slot).to.deep.equal(props.slots[index]);
        });
      });
    });
  });

  describe('without timeslots', () => {
    const props = {
      isFetching: false,
      slots: [],
    };
    let tree;

    before(() => {
      tree = sd.shallowRender(<TimeSlots {...props} />);
    });

    it('should render a message telling the resource is not available for reservation', () => {
      const expected = 'Tila ei ole tänään avoinna.';

      expect(tree.textIn('p')).to.equal(expected);
    });
  });
});
