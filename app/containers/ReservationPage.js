import _ from 'lodash';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import ResourceHeader from 'components/resource/ResourceHeader';
import NotFoundPage from 'containers/NotFoundPage';
import ReservationForm from 'containers/ReservationForm';
import reservationPageSelector from 'selectors/containers/reservationPageSelector';
import { getAddressWithName, getName } from 'utils/DataUtils';
import { getDateStartAndEndTimes } from 'utils/TimeUtils';

export class UnconnectedReservationPage extends Component {
  componentDidMount() {
    const { actions, date, id } = this.props;
    const fetchParams = getDateStartAndEndTimes(date);

    actions.fetchResource(id, fetchParams);
  }

  renderMaxPeriod(maxPeriod) {
    if (!maxPeriod) {
      return null;
    }
    return (
      <p>Tämän tilan voi varata enimmillään {moment.duration(maxPeriod).asHours()} tunniksi.</p>
    );
  }

  render() {
    const {
      id,
      isFetchingResource,
      isLoggedIn,
      resource,
      unit,
    } = this.props;
    const resourceName = getName(resource);

    if (_.isEmpty(resource) && !isFetchingResource) {
      return <NotFoundPage />;
    }

    return (
      <DocumentTitle title={`${resourceName} varaaminen - Respa`}>
        <Loader loaded={!_.isEmpty(resource)}>
          <div className="reservation-page"v>
            <ResourceHeader
              address={getAddressWithName(unit)}
              name={resourceName}
            />
            <LinkContainer to={`/resources/${id}`}>
              <Button
                bsSize="large"
                bsStyle="primary"
                className="responsive-button"
              >
                Tilan tiedot
              </Button>
            </LinkContainer>
            {this.renderMaxPeriod(resource.maxPeriod)}
            <h2>{isLoggedIn ? 'Varaa tila' : 'Varaustilanne'}</h2>
            {!isLoggedIn &&
              <p><a href="/login">Kirjaudu sisään</a> voidaksesi tehdä varauksen tähän tilaan.</p>
            }
            <ReservationForm />
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
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
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
