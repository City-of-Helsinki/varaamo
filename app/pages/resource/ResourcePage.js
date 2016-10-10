import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import PageWrapper from 'pages/PageWrapper';
import NotFoundPage from 'pages/not-found/NotFoundPage';
import { getDateStartAndEndTimes } from 'utils/timeUtils';
import { getName } from 'utils/translationUtils';
import ReservationCalendar from './reservation-calendar';
import ReservationConfirmation from './reservation-confirmation';
import ReservationInfo from './reservation-info';
import ResourceInfo from './resource-info';
import resourcePageSelector from './resourcePageSelector';

export class UnconnectedResourcePage extends Component {
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
      <PageWrapper className="resource-page" title={`${resourceName}`}>
        <Loader loaded={!isEmpty(resource)}>
          <ResourceInfo
            isAdmin={isAdmin}
            resource={resource}
            unit={unit}
          />
          <h2 id="reservation-header">{isLoggedIn ? 'Varaa tila' : 'Varaustilanne'}</h2>
          <ReservationInfo
            isLoggedIn={isLoggedIn}
            resource={resource}
          />
          <ReservationCalendar
            location={location}
            params={params}
          />
          <ReservationConfirmation params={params} />
        </Loader>
      </PageWrapper>
    );
  }
}

UnconnectedResourcePage.propTypes = {
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

export default connect(resourcePageSelector, mapDispatchToProps)(UnconnectedResourcePage);
