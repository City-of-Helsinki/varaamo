import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Resource from 'fixtures/Resource';
import TimeSlot from 'fixtures/TimeSlot';
import TimeSlots from './TimeSlots';

describe('Component: reservation/TimeSlots', () => {
  describe('with timeslots', () => {
    const timeSlots = [
      TimeSlot.build(),
      TimeSlot.build(),
    ];
    const props = {
      addNotification: simple.stub(),
      isAdmin: false,
      isEditing: false,
      isFetching: false,
      isLoggedIn: true,
      isStaff: false,
      onClick: simple.stub(),
      resource: Resource.build(),
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
          expect(timeSlotTree.props.addNotification).to.equal(props.addNotification);
          expect(timeSlotTree.props.isAdmin).to.equal(props.isAdmin);
          expect(timeSlotTree.props.isEditing).to.equal(props.isEditing);
          expect(timeSlotTree.props.isLoggedIn).to.equal(props.isLoggedIn);
          expect(timeSlotTree.props.isStaff).to.equal(props.isStaff);
          expect(timeSlotTree.props.onClick).to.equal(props.onClick);
          expect(timeSlotTree.props.resource).to.equal(props.resource);
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
      addNotification: simple.stub(),
      isAdmin: false,
      isEditing: false,
      isFetching: false,
      isLoggedIn: true,
      isStaff: false,
      onClick: simple.stub(),
      resource: Resource.build(),
      selected: [],
      slots: [],
    };
    let tree;

    before(() => {
      tree = sd.shallowRender(<TimeSlots {...props} />);
    });

    it('should render a message telling the resource is not available for reservation', () => {
      const expected = 'Tila ei ole varattavissa tänä päivänä.';

      expect(tree.textIn('p')).to.equal(expected);
    });
  });
});
