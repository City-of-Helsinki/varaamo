import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
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
      isLoadingUnits: false,
      reservations: [],
      units: [],
    };
  }

  componentDidMount() {
    this.loadUnits();
    this.loadReservations();
  }

  loadReservations = () => {
    this.setState({
      isLoading: true,
    });

    client.get('reservation', { page_size: 20 })
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          reservations: get(data, 'results', []),
        });
      });
  };

  loadUnits = () => {
    this.setState({
      isLoadingUnits: true,
    });

    client.get('unit', { page_size: 500, unit_has_resource: true })
      .then(({ data }) => {
        this.setState({
          isLoadingUnits: false,
          units: get(data, 'results', []),
        });
      });
  };

  render() {
    const {
      t,
    } = this.props;

    const {
      isLoading,
      isLoadingUnits,
      reservations,
      units,
    } = this.state;

    return (
      <div className="app-ManageReservationsPage">
        <div className="app-ManageReservationsPage__list">
          <PageWrapper title={t('ManageReservationsPage.title')}>
            <Loader loaded={!isLoading && !isLoadingUnits}>
              <ManageReservationsList
                reservations={reservations}
                units={units}
              />
            </Loader>
          </PageWrapper>
        </div>
      </div>
    );
  }
}

export default injectT(ManageReservationsPage);
