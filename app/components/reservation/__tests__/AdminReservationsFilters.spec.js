import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import Select from 'react-select';

import AdminReservationsFilters from 'components/reservation/AdminReservationsFilters';

describe('Component: reservation/AdminReservationsFilters', () => {
  const defaultProps = {
    onFiltersChange: simple.stub(),
    filters: { state: 'requested' },
  };

  function getWrapper(extraProps) {
    return shallow(<AdminReservationsFilters {...defaultProps} {...extraProps} />);
  }

  describe('state filter', () => {
    const select = getWrapper().find(Select);

    it('should render a Select component', () => {
      expect(select.length).to.equal(1);
    });

    it('should pass correct value to the Select component', () => {
      expect(select.props().value).to.equal(defaultProps.filters.state);
    });

    it('should pass correct options to the Select component', () => {
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
      const filterValue = 'new-value';

      before(() => {
        select.props().onChange(filterValue);
      });

      it('should call onFiltersChange ', () => {
        expect(defaultProps.onFiltersChange.callCount).to.equal(1);
      });

      it('should call onFiltersChange with correct arguments', () => {
        const expected = { state: filterValue };
        expect(defaultProps.onFiltersChange.lastCall.args[0]).to.deep.equal(expected);
      });
    });
  });
});
