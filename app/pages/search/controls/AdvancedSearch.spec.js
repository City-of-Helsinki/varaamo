import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Select from 'react-select';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import AdvancedSearch from './AdvancedSearch';

describe('Component: search/controls/AdvancedSearch', () => {
  const defaultProps = {
    isFetchingPurposes: false,
    onFiltersChange: simple.stub(),
    filters: { purpose: 'filter-1' },
    purposeOptions: Immutable([
      { value: 'filter-1', label: 'Label 1' },
      { value: 'filter-2', label: 'Label 2' },
    ]),
  };

  function getWrapper(extraProps) {
    return shallow(<AdvancedSearch {...defaultProps} {...extraProps} />);
  }

  describe('Panel component', () => {
    it('renders', () => {
      const panel = getWrapper().find(Panel);
      expect(panel).to.have.length(1);
    });

    it('is closed if filters does not contain purpose', () => {
      const filters = {};
      const panel = getWrapper({ filters }).find(Panel);
      expect(panel.props().defaultExpanded).to.be.false;
    });

    it('is closed if purpose in filters is not a valid purpose value', () => {
      const filters = { purpose: 'invalid-purpose' };
      const panel = getWrapper({ filters }).find(Panel);
      expect(panel.props().defaultExpanded).to.be.false;
    });

    it('is open if filters contain valid purpose value', () => {
      const filters = { purpose: 'filter-1' };
      const panel = getWrapper({ filters }).find(Panel);
      expect(panel.props().defaultExpanded).to.be.true;
    });
  });

  describe('purpose select', () => {
    const select = getWrapper().find(Select);

    it('renders a Select component', () => {
      expect(select.length).to.equal(1);
    });

    it('passes correct props to the Select component', () => {
      const actualProps = select.props();

      expect(actualProps.clearable).to.equal(true);
      expect(actualProps.isLoading).to.equal(defaultProps.isFetchingPurposes);
      expect(typeof actualProps.onChange).to.equal('function');
      expect(actualProps.options).to.deep.equal(defaultProps.purposeOptions);
      expect(typeof actualProps.placeholder).to.equal('string');
      expect(actualProps.value).to.equal(defaultProps.filters.purpose);
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
        const expected = { purpose: filterOption.value };

        expect(defaultProps.onFiltersChange.lastCall.args[0]).to.deep.equal(expected);
      });
    });
  });
});
