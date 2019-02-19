import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';

import SelectControl from 'pages/search/controls/SelectControl';
import { shallowWithIntl } from 'utils/testUtils';
import AdminReservationFilters from './AdminReservationFilters';

describe('pages/user-reservations/reservation-filters/AdminReservationFilters', () => {
  const defaultProps = {
    onFiltersChange: simple.stub(),
    filters: { state: 'requested' },
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<AdminReservationFilters {...defaultProps} {...extraProps} />);
  }

  describe('state filter', () => {
    const select = getWrapper().find(SelectControl);

    it('renders a Select component', () => {
      expect(select.length).to.equal(1);
    });

    it('passes correct value to the Select component', () => {
      expect(select.props().value).to.equal(defaultProps.filters.state);
    });

    it('passes correct options to the Select component', () => {
      const expected = [
        { label: 'common.optionsAllLabel', value: 'all' },
        { label: 'common.cancelled', value: 'cancelled' },
        { label: 'common.confirmed', value: 'confirmed' },
        { label: 'common.denied', value: 'denied' },
        { label: 'common.requested', value: 'requested' },
      ];
      expect(select.props().options).to.deep.equal(expected);
    });

    describe('onChange', () => {
      const filterOption = { label: 'Label', value: 'new-value' };

      beforeAll(() => {
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
