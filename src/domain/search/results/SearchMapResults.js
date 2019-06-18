import React from 'react';
import PropTypes from 'prop-types';

class SearchMapResults extends React.Component {
  static propTypes = {
    resources: PropTypes.array,
    isLoading: PropTypes.bool,
  };

  render() {
    const { isLoading, resources } = this.props;
    return (
      <div className="app-SearchMapResults">
        SearchMapResults
      </div>
    );
  }
}

export default SearchMapResults;
