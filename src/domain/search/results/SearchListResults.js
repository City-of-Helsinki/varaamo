import React from 'react';
import PropTypes from 'prop-types';

class SearchListResults extends React.Component {
  static propTypes = {
    resources: PropTypes.array,
    isLoading: PropTypes.bool,
  };

  render() {
    const { isLoading, resources } = this.props;
    return (
      <div className="app-SearchListResults">
        SearchListResults
        <ul>
          {resources && resources.map((item, i) => <li key={`item-${i}`}>{item.id}: {item.name.fi}</li>)}
        </ul>
      </div>
    );
  }
}

export default SearchListResults;
