import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Label from 'react-bootstrap/lib/Label';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import TimeSlotFixture from 'fixtures/TimeSlot';
import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import TimeSlot from './TimeSlot';

describe('screens/resource/reservation-calendar/time-slots/TimeSlot', () => {
  const defaultProps = {
    addNotification: simple.stub(),
    isAdmin: false,
    isEditing: true,
    isLoggedIn: true,
    isStaff: false,
    onClick: simple.stub(),
    resource: Resource.build(),
    selected: false,
    slot: Immutable(TimeSlotFixture.build()),
  };

  function getWrapper(extraProps) {
    return shallow(<TimeSlot {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    describe('when the slot is not reserved', () => {
      const wrapper = getWrapper();

      it('renders a table row', () => {
        const tableRow = wrapper.find('tr');

        expect(tableRow.length).to.equal(1);
      });

      it('clicking the table row calls props.onClick with correct arguments', () => {
        wrapper.find('tr').props().onClick();

        expect(defaultProps.onClick.callCount).to.equal(1);
      });

      describe('table cells', () => {
        const tableCells = wrapper.find('td');

        it('renders 4 table cells', () => {
          expect(tableCells).to.have.length(4);
        });

        describe('the first table cell', () => {
          const tableCell = tableCells.at(0);
          const glyphIcon = tableCell.find(Glyphicon);

          it('renders a checkbox icon', () => {
            expect(glyphIcon.length).to.equal(1);
          });

          it('is not checked', () => {
            expect(glyphIcon.props().glyph).to.equal('unchecked');
          });
        });

        describe('the second table cell', () => {
          const tableCell = tableCells.at(1);

          it('displays the slot time range as a string', () => {
            expect(tableCell.text()).to.equal(defaultProps.slot.asString);
          });

          it('has the specific time range inside a "time" element', () => {
            const time = tableCell.find('time');
            const expected = `${defaultProps.slot.start}/${defaultProps.slot.end}`;

            expect(time.props().dateTime).to.equal(expected);
          });
        });

        describe('the third table cell', () => {
          const tableCell = tableCells.at(2);
          const label = tableCell.find(Label);

          it('contains a label with correct props', () => {
            expect(label.length).to.equal(1);
            expect(label.props().bsStyle).to.equal('success');
          });

          it('displays text "Vapaa"', () => {
            expect(label.props().children).to.equal('Vapaa');
          });
        });
      });
    });

    describe('when the slot is reserved', () => {
      const extraProps = {
        slot: Immutable(TimeSlotFixture.build({
          reserved: true,
          reservation: Reservation.build(),
        })),
      };
      const wrapper = getWrapper(extraProps);

      it('renders a label with correct props', () => {
        const label = wrapper.find(Label);

        expect(label.length).to.equal(1);
        expect(label.props().bsStyle).to.equal('danger');
      });

      it('displays text "Varattu"', () => {
        const label = wrapper.find(Label);

        expect(label.props().children).to.equal('Varattu');
      });
    });
  });
});
