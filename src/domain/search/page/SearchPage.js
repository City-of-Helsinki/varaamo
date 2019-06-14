import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';

import injectT from '../../../../app/i18n/injectT';
import client from '../../../common/api/client';
import PageWrapper from '../../../../app/pages/PageWrapper';
import SearchFilters from '../filters/SearchFilters';
import SearchPagination from '../pagination/SearchPagination';

class SearchPage extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });

    client.get('resource')
      .then(({ data, error }) => {
        console.log(data, error);

        this.setState({
          isLoading: false,
        });
      });
  }

  render() {
    const { t } = this.props;
    const { isLoading } = this.state;

    return (
      <div className="app-SearchPage">
        <SearchFilters />
        <PageWrapper className="app-SearchPage__wrapper" title={t('SearchPage.title')} transparent>
          <Loader loaded={!isLoading}>
            <div className="app-SearchPage__results">
              Results
            </div>
            <div className="app-SearchPage__pagination">
              <SearchPagination
                onChange={(newPage) => {
                  console.log(newPage);
                }}
                page={5}
                pages={12}
              />
            </div>
          </Loader>
        </PageWrapper>
      </div>
    );
  }
}

export default injectT(SearchPage);
