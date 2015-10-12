import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import TimeSlot from 'components/reservation/TimeSlot';
import TimeSlotFixture from 'fixtures/TimeSlot';

describe('Component: TimeSlot', () => {
  const props = {
    slot: Immutable(TimeSlotFixture.build()),
  };
  const tree = sd.shallowRender(<TimeSlot {...props} />);
  const vdom = tree.getRenderOutput();

  it('should render a table row', () => {
    expect(vdom.type).to.equal('tr');
  });

  describe('table cells', () => {
    const tdTrees = tree.everySubTree('td');

    it('should render 2 table cells', () => {
      expect(tdTrees).to.have.length(2);
    });

    describe('the first table cell', () => {
      const tdTree = tdTrees[0];

      it('should display the slot time range as string', () => {
        expect(tdTree.text()).to.equal(props.slot.asString);
      });

      it('should have the specific time range inside a "time" element', () => {
        const timeVdom = tdTree.subTree('time').getRenderOutput();
        const expected = `${props.slot.start}/${props.slot.end}`;

        expect(timeVdom.props.dateTime).to.equal(expected);
      });
    });

    describe('the second table cell', () => {
      const tdTree = tdTrees[1];

      it('should show whether the slot is reserved or not', () => {
        const expected = 'Vapaa';

        expect(tdTree.text()).to.equal(expected);
      });
    });
  });
});
