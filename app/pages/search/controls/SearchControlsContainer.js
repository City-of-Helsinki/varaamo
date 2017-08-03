import moment from 'moment';
import queryString from 'query-string';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import { fetchPurposes } from 'actions/purposeActions';
import { changeSearchFilters } from 'actions/uiActions';
import constants from 'constants/AppConstants';
import DatePickerControl from './DatePickerControl';
import PeopleCapacityControl from './PeopleCapacityControl';
import PurposeControl from './PurposeControl';
import SearchBox from './SearchBox';
import searchControlsSelector from './searchControlsSelector';

class UnconnectedSearchControlsContainer extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    isFetchingPurposes: PropTypes.bool.isRequired,
    purposeOptions: PropTypes.array.isRequired,
    scrollToSearchResults: PropTypes.func.isRequired,
    urlSearchFilters: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { actions, urlSearchFilters } = this.props;
    actions.changeSearchFilters(urlSearchFilters);
    actions.fetchPurposes();
  }

  handleDateChange = (date) => {
    const dateInCorrectFormat = (
      moment(date, 'L').format(constants.DATE_FORMAT)
    );
    this.handleFiltersChange({ date: dateInCorrectFormat });
  }

  handleFiltersChange = (newFilters) => {
    this.props.actions.changeSearchFilters(newFilters);
    this.handleSearch(newFilters);
  }

  handleSearchBoxChange = (value) => {
    this.props.actions.changeSearchFilters({ search: value });
  }

  handleSearch = (newFilters = {}, options = {}) => {
    const { scrollToSearchResults } = this.props;
    const filters = { ...this.props.filters, ...newFilters };
    browserHistory.push(`/?${queryString.stringify(filters)}`);
    if (!options.preventScrolling) {
      scrollToSearchResults();
    }
  }

  render() {
    const {
      filters,
      isFetchingPurposes,
      purposeOptions,
    } = this.props;

    return (
      <div className="app-SearchControlsContainer">
        <SearchBox
          onChange={this.handleSearchBoxChange}
          onSearch={this.handleSearch}
          value={filters.search}
        />
        <div className="app-SearchControlsContainer__filters">
          <PurposeControl
            isLoading={isFetchingPurposes}
            onConfirm={purpose => this.handleFiltersChange({ purpose })}
            purposeOptions={purposeOptions}
            value={filters.purpose}
          />
          <DatePickerControl
            onConfirm={this.handleDateChange}
            value={moment(filters.date).format('L')}
          />
          <PeopleCapacityControl
            onConfirm={people => this.handleFiltersChange({ people })}
            value={filters.people ? parseInt(filters.people, 10) : 1}
          />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeSearchFilters,
    fetchPurposes,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedSearchControlsContainer };
export default connect(searchControlsSelector, mapDispatchToProps)(
  UnconnectedSearchControlsContainer
);
