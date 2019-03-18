import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { injectT } from 'i18n';
import SelectControl from './controls/SelectControl';

class Sort extends Component {
  constructor(props) {
    super();
    this.state = {
      selected: '',
    };

    const { lang } = props;
    this.sortOptions = [
      { label: 'Name', value: `resource_name_${lang}` },
      { label: 'Type', value: 'type' },
      { label: 'Premises', value: `unit_name_${lang}` },
      { label: 'People', value: 'people_capacity' },
      { label: 'Open now', value: 'sortByOpenNow' },
    ];
  }

  handleChange = ({ value }) => {
    const filters = {};
    if (value === 'sortByOpenNow') {
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
