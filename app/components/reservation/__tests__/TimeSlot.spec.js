import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import TimeSlot from 'components/reservation/TimeSlot';
import TimeSlotFixture from 'fixtures/TimeSlot';

describe('Component: reservation/TimeSlot', () => {
  const props = {
    isLoggedIn: true,
    onClick: simple.stub(),
    selected: false,
    slot: Immutable(TimeSlotFixture.build()),
  };
  const tree = sd.shallowRender(<TimeSlot {...props} />);
  const vdom = tree.getRenderOutput();

  it('should render a table row', () => {
    expect(vdom.type).to.equal('tr');
  });

  it('clicking the table row should call props.onClick with correct arguments', () => {
    tree.props.onClick();

    expect(props.onClick.callCount).to.equal(1);
  });

  describe('table cells', () => {
    const tdTrees = tree.everySubTree('td');

    it('should render 3 table cells', () => {
      expect(tdTrees).to.have.length(3);
    });

    describe('the first table cell', () => {
      const tdTree = tdTrees[0];
      const glyphiconTree = tdTree.subTree('Glyphicon');

      it('should render a checkbox icon', () => {
        expect(glyphiconTree).to.be.ok;
      });

      it('should not be checked if the slot is available', () => {
        expect(glyphiconTree.props.glyph).to.equal('unchecked');
      });
    });

    describe('the second table cell', () => {
      const tdTree = tdTrees[1];

      it('should display the slot time range as string', () => {
        expect(tdTree.text()).to.equal(props.slot.asString);
      });

      it('should have the specific time range inside a "time" element', () => {
        const timeTree = tdTree.subTree('time');
        const expected = `${props.slot.start}/${props.slot.end}`;

        expect(timeTree.props.dateTime).to.equal(expected);
      });
    });

    describe('the third table cell', () => {
      describe('when the slot is available', () => {
        const tdTree = tdTrees[2];
        const labelTrees = tdTree.everySubTree('Label');

        it('should render a label', () => {
          expect(labelTrees.length).to.equal(1);
        });

        it('should give proper props to the label', () => {
          expect(labelTrees[0].props.bsStyle).to.equal('success');
        });

        it('should display text "Vapaa"', () => {
          const expected = 'Vapaa';

          expect(labelTrees[0].props.children).to.equal(expected);
        });
      });

      describe('when the slot is reserved', () => {
        const reservedProps = {
          isLoggedIn: true,
          onClick: simple.stub(),
          selected: false,
          slot: Immutable(TimeSlotFixture.build({ reserved: true })),
        };
        const reservedTree = sd.shallowRender(<TimeSlot {...reservedProps} />);
        const tdTree = reservedTree.everySubTree('td')[2];
        const labelTrees = tdTree.everySubTree('Label');

        it('should render a label', () => {
          expect(labelTrees.length).to.equal(1);
        });

        it('should give proper props to the label', () => {
          expect(labelTrees[0].props.bsStyle).to.equal('danger');
        });

        it('should display text "Varattu"', () => {
          const expected = 'Varattu';

          expect(labelTrees[0].props.children).to.equal(expected);
        });
      });
    });
  });
});
