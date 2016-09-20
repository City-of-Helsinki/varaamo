import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import ResourceHeader from 'components/resource/ResourceHeader';
import ReservationInfo from 'components/reservation/ReservationInfo';
import NotFoundPage from 'containers/NotFoundPage';
import ReservationCalendar from 'containers/ReservationCalendar';
import FavoriteButton from 'screens/shared/favorite-button';
import reservationPageSelector from 'selectors/containers/reservationPageSelector';
import { getName } from 'utils/DataUtils';
import { getDateStartAndEndTimes } from 'utils/TimeUtils';
import { getAddressWithName } from 'utils/unitUtils';

export class UnconnectedReservationPage extends Component {
  componentDidMount() {
    const { actions, date, id } = this.props;
    const fetchParams = getDateStartAndEndTimes(date);

    actions.fetchResource(id, fetchParams);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.date !== this.props.date) {
      const { actions, id } = this.props;
      const fetchParams = getDateStartAndEndTimes(nextProps.date);

      actions.fetchResource(id, fetchParams);
    }
  }

  render() {
    const {
      date,
      id,
      isAdmin,
      isFetchingResource,
      isLoggedIn,
      location,
      params,
      resource,
      unit,
    } = this.props;
    const resourceName = getName(resource);

    if (isEmpty(resource) && !isFetchingResource) {
      return <NotFoundPage />;
    }

    return (
      <DocumentTitle title={`${resourceName} - varauskalenteri - Varaamo`}>
        <Loader loaded={!isEmpty(resource)}>
          <div className="reservation-page"v>
            <ResourceHeader
              address={getAddressWithName(unit)}
              name={resourceName}
            />
            {isAdmin && <FavoriteButton resource={resource} />}
            <LinkContainer to={`/resources/${id}?date=${date.split('T')[0]}`}>
              <Button
                bsSize="large"
                bsStyle="primary"
                className="responsive-button"
              >
                Tilan tiedot
              </Button>
            </LinkContainer>
            <ReservationInfo
              isLoggedIn={isLoggedIn}
              resource={resource}
            />
            <h2 id="reservation-header">{isLoggedIn ? 'Varaa tila' : 'Varaustilanne'}</h2>
            <ReservationCalendar
              location={location}
              params={params}
            />
          </div>
        </Loader>
      </DocumentTitle>
    );
  }
}

UnconnectedReservationPage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchResource,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationPageSelector, mapDispatchToProps)(UnconnectedReservationPage);
