import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import TimeSlot from 'components/reservation/TimeSlot';
import TimeSlotFixture from 'fixtures/TimeSlot';

describe('Component: reservation/TimeSlot', () => {
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
      describe('when the slot is available', () => {
        const tdTree = tdTrees[1];
        const labelTrees = tdTree.everySubTree('Label');
        const labelVdom = labelTrees[0].getRenderOutput();

        it('should render a label', () => {
          expect(labelTrees.length).to.equal(1);
        });

        it('should give proper props to the label', () => {
          expect(labelVdom.props.bsStyle).to.equal('success');
        });

        it('should display a text whether the slot is reserved or not', () => {
          const expected = 'Vapaa';

          expect(labelVdom.props.children).to.equal(expected);
        });
      });

      describe('when the slot is reserved', () => {
        const reservedProps = {
          slot: Immutable(TimeSlotFixture.build({ reserved: true })),
        };
        const reservedTree = sd.shallowRender(<TimeSlot {...reservedProps} />);
        const tdTree = reservedTree.everySubTree('td')[1];
        const labelTrees = tdTree.everySubTree('Label');
        const labelVdom = labelTrees[0].getRenderOutput();

        it('should render a label', () => {
          expect(labelTrees.length).to.equal(1);
        });

        it('should give proper props to the label', () => {
          expect(labelVdom.props.bsStyle).to.equal('danger');
        });

        it('should display a text whether the slot is reserved or not', () => {
          const expected = 'Varattu';

          expect(labelVdom.props.children).to.equal(expected);
        });
      });
    });
  });
});
