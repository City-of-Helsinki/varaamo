import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { injectT } from 'i18n';
import CONSTANTS from '../../constants/AppConstants';
import SelectControl from './controls/SelectControl';

class Sort extends Component {
  constructor(props) {
    super();
    this.state = {
      selected: '',
    };
    const { lang } = props;
    this.sortOptions = [
      { label: 'Name', value: CONSTANTS.SORT_BY_OPTIONS.RESOURCE_NAME.replace('lang', lang) },
      { label: 'Type', value: CONSTANTS.SORT_BY_OPTIONS.TYPE.replace('lang', lang) },
      { label: 'Premises', value: CONSTANTS.SORT_BY_OPTIONS.PREMISES.replace('lang', lang) },
      { label: 'People', value: CONSTANTS.SORT_BY_OPTIONS.PEOPLE },
      { label: 'Open now', value: CONSTANTS.SORT_BY_OPTIONS.OPEN_NOW },
    ];
  }

  handleChange = ({ value }) => {
    const filters = {};
    if (value === CONSTANTS.SORT_BY_OPTIONS.OPEN_NOW) {
      const now = (new Date()).toISOString();
      filters.orderBy = null;
      filters.available_between = `${now},${now}`;
    } else {
      filters.orderBy = value;
    }
    this.props.sortBy(filters);
  }

  render() {
    return (
      <SelectControl
        id="sort"
        isLoading={false}
        label={this.props.t('SortBy.label')}
        onChange={this.handleChange}
        options={this.sortOptions}
        value={this.state.selected}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.intl.locale
});

export default connect(
  mapStateToProps,
  {}
)(injectT(Sort));


Sort.propTypes = {
  lang: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  sortBy: PropTypes.func.isRequired
};
