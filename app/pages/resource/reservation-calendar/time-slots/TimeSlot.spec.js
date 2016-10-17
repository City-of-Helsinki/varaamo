import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Label from 'react-bootstrap/lib/Label';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import TimeSlotFixture from 'utils/fixtures/TimeSlot';
import TimeSlot, { getLabelData } from './TimeSlot';

describe('pages/resource/reservation-calendar/time-slots/TimeSlot', () => {
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

  describe('getLabelData', () => {
    describe('when time is in the past', () => {
      const isPast = true;

      it('returns correct data if slot is being edited', () => {
        const slot = { editing: true };
        const labelData = getLabelData({ isPast, slot });
        const expected = { bsStyle: 'default', text: 'Muokataan' };

        expect(labelData).to.deep.equal(expected);
      });

      it('returns correct data if slot is reserved', () => {
        const slot = { reserved: true };
        const labelData = getLabelData({ isPast, slot });
        const expected = { bsStyle: 'default', text: 'Varattu' };

        expect(labelData).to.deep.equal(expected);
      });

      it('returns correct data if slot contains own reservation', () => {
        const slot = { reserved: true };
        const isOwnReservation = true;
        const labelData = getLabelData({ isOwnReservation, isPast, slot });
        const expected = { bsStyle: 'default', text: 'Oma varaus' };

        expect(labelData).to.deep.equal(expected);
      });

      it('returns correct data if slot is not reserved', () => {
        const slot = { reserved: false };
        const labelData = getLabelData({ isPast, slot });
        const expected = { bsStyle: 'default', text: 'Vapaa' };

        expect(labelData).to.deep.equal(expected);
      });
    });

    describe('when time is not in the past', () => {
      const isPast = false;

      it('returns correct data if slot is being edited', () => {
        const slot = { editing: true };
        const labelData = getLabelData({ isPast, slot });
        const expected = { bsStyle: 'info', text: 'Muokataan' };

        expect(labelData).to.deep.equal(expected);
      });

      it('returns correct data if slot is reserved', () => {
        const slot = { reserved: true };
        const labelData = getLabelData({ isPast, slot });
        const expected = { bsStyle: 'danger', text: 'Varattu' };

        expect(labelData).to.deep.equal(expected);
      });

      it('returns correct data if slot contains own reservation', () => {
        const slot = { reserved: true };
        const isOwnReservation = true;
        const labelData = getLabelData({ isOwnReservation, isPast, slot });
        const expected = { bsStyle: 'info', text: 'Oma varaus' };

        expect(labelData).to.deep.equal(expected);
      });

      it('returns correct data if slot is not reserved', () => {
        const slot = { reserved: false };
        const labelData = getLabelData({ isPast, slot });
        const expected = { bsStyle: 'success', text: 'Vapaa' };

        expect(labelData).to.deep.equal(expected);
      });
    });
  });

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
