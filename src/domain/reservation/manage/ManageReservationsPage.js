import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Loader from 'react-loader';

import PageWrapper from '../../../../app/pages/PageWrapper';
import injectT from '../../../../app/i18n/injectT';
import client from '../../../common/api/client';
import ManageReservationsList from './list/ManageReservationsList';

class ManageReservationsPage extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      reservations: [],
    };
  }

  componentDidMount() {
    this.loadReservations();
  }

  loadReservations = () => {
    this.setState({
      isLoading: true,
    });

    client.get('reservation', { page_size: 8 })
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          reservations: get(data, 'results', []),
        });
      });
  };

  render() {
    const {
      t,
    } = this.props;

    const {
      isLoading,
      reservations,
    } = this.state;

    return (
      <div className="app-ManageReservationsPage">
        <div className="app-ManageReservationsPage__list">
          <PageWrapper title={t('ManageReservationsPage.title')}>
            <Loader loaded={!isLoading}>
              <ManageReservationsList
                reservations={reservations}
              />
            </Loader>
          </PageWrapper>
        </div>
      </div>
    );
  }
}

export default injectT(ManageReservationsPage);
