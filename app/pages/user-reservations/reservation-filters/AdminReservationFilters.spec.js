import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Select from 'react-select';
import simple from 'simple-mock';

import AdminReservationFilters from './AdminReservationFilters';

describe('pages/user-reservations/reservation-filters/AdminReservationFilters', () => {
  const defaultProps = {
    onFiltersChange: simple.stub(),
    filters: { state: 'requested' },
  };

  function getWrapper(extraProps) {
    return shallow(<AdminReservationFilters {...defaultProps} {...extraProps} />);
  }

  describe('state filter', () => {
    const select = getWrapper().find(Select);

    it('renders a Select component', () => {
      expect(select.length).to.equal(1);
    });

    it('passes correct value to the Select component', () => {
      expect(select.props().value).to.equal(defaultProps.filters.state);
    });

    it('passes correct options to the Select component', () => {
      const expected = [
        { label: 'Kaikki', value: 'all' },
        { label: 'Hylätty', value: 'denied' },
        { label: 'Hyväksytty', value: 'confirmed' },
        { label: 'Käsiteltävänä', value: 'requested' },
        { label: 'Peruttu', value: 'cancelled' },
      ];

      expect(select.props().options).to.deep.equal(expected);
    });

    describe('onChange', () => {
      const filterOption = { label: 'Label', value: 'new-value' };

      before(() => {
        select.props().onChange(filterOption);
      });

      it('calls onFiltersChange ', () => {
        expect(defaultProps.onFiltersChange.callCount).to.equal(1);
      });

      it('calls onFiltersChange with correct arguments', () => {
        const expected = { state: filterOption.value };
        expect(defaultProps.onFiltersChange.lastCall.args[0]).to.deep.equal(expected);
      });
    });
  });
});
