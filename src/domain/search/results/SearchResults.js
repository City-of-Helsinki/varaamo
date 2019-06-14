import React from 'react';
import Loader from 'react-loader';
import PropTypes from 'prop-types';

class SearchResults extends React.Component {
  static propTypes = {
    resources: PropTypes.array,
    isLoading: PropTypes.bool,
  };

  render() {
    const { isLoading, resources } = this.props;
    return (
      <div className="app-SearchResults" id="search-results" ref={this.searchResultsComponent}>

      </div>
    );
  }
}

export default SearchResults;
