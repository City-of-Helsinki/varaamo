import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { injectT } from 'i18n';
import SelectControl from './controls/SelectControl';
import * as filterActions from '../../actions/filterActions';

class Filter extends Component {
  constructor() {
    super();
    this.state = {
      selected: '',
    };
    this.filterOptions = [
      { label: 'Name', value: 'filterByName' },
      { label: 'Type', value: 'filterByType' },
      { label: 'Premises', value: 'filterByPremises' },
      { label: 'People', value: 'filterByPeople' },
      { label: 'Open now', value: 'filterByOpenNow' },
    ];
  }

  dispatchFilter = (filterName) => {
    const { actions, lang, resources, units } = this.props;
    this.setState({ selected: filterName });
    actions[filterName]({ lang, resources, units });
  }

  render() {
    return (
      <SelectControl
        id="filter"
        isLoading={false}
        label={this.props.t('SortBy.label')}
        onConfirm={this.dispatchFilter}
        options={this.filterOptions}
        value={this.state.selected}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.intl.locale,
  resources: state.data.resources,
  units: state.data.units,
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(filterActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectT(Filter));


Filter.propTypes = {
  actions: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  resources: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

