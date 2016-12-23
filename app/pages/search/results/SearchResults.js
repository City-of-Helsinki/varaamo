import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import Loader from 'react-loader';

import ResourceList from 'shared/resource-list';
import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';
import ResultsCount from './ResultsCount';

class SearchResults extends Component {
  componentDidMount() {
    scrollTo(findDOMNode(this));
  }

  render() {
    const { isFetching, searchResultIds, t } = this.props;

    return (
      <div id="search-results">
        <Loader loaded={!isFetching}>
          <ResultsCount
            emptyMessage={t('SearchResults.emptyMessage')}
            resultIds={searchResultIds}
          />
          <ResourceList
            resourceIds={searchResultIds}
          />
        </Loader>
      </div>
    );
  }
}

SearchResults.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  searchResultIds: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(SearchResults);
