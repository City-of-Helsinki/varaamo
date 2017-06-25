import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import PageWrapper from 'pages/PageWrapper';
import NotFoundPage from 'pages/not-found/NotFoundPage';
import DateHeader from 'shared/date-header';
import ReservationConfirmation from 'shared/reservation-confirmation';
import ResourceCalendar from 'shared/resource-calendar';
import { injectT } from 'i18n';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { addToDate } from 'utils/timeUtils';
import ReservationCalendar from './reservation-calendar';
import ReservationInfo from './reservation-info';
import ResourceInfo from './resource-info';
import resourcePageSelector from './resourcePageSelector';

class UnconnectedResourcePage extends Component {
  constructor(props) {
    super(props);
    this.fetchResource = this.fetchResource.bind(this);
  }

  componentDidMount() {
    this.fetchResource();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.date !== this.props.date || nextProps.isLoggedIn !== this.props.isLoggedIn) {
      this.fetchResource(nextProps.date);
    }
  }

  fetchResource(date = this.props.date) {
    const { actions, id } = this.props;
    const start = moment(date).subtract(2, 'M').startOf('month').format();
    const end = moment(date).add(2, 'M').endOf('month').format();

    actions.fetchResource(id, { start, end });
  }

  handleDateChange = (newDate) => {
    const { resource } = this.props;
    const day = newDate.toISOString().substring(0, 10);
    browserHistory.push(getResourcePageUrl(resource, day));
  }

  decreaseDate = () => {
    this.handleDateChange(new Date(addToDate(this.props.date, -1)));
  }

  increaseDate = () => {
    this.handleDateChange(new Date(addToDate(this.props.date, 1)));
  }

  render() {
    const {
      date,
      isAdmin,
      isFetchingResource,
      isLoggedIn,
      location,
      params,
      resource,
      t,
      unit,
    } = this.props;

    if (isEmpty(resource) && !isFetchingResource) {
      return <NotFoundPage />;
    }

    return (
      <PageWrapper className="app-ResourcePage" title={resource.name || ''}>
        <Loader loaded={!isEmpty(resource)}>
          <ResourceInfo
            isAdmin={isAdmin}
            resource={resource}
            unit={unit}
          />
          <h2 id="reservation-header">
            {isLoggedIn ?
              t('ResourcePage.reserveHeader') :
              t('ResourcePage.reservationStatusHeader')
            }
          </h2>
          <ReservationInfo
            isLoggedIn={isLoggedIn}
            resource={resource}
          />
          <ResourceCalendar
            onDateChange={this.handleDateChange}
            resourceId={resource.id}
            selectedDate={date}
          />
          <DateHeader
            date={date}
            onDecreaseDateButtonClick={this.decreaseDate}
            onIncreaseDateButtonClick={this.increaseDate}
            scrollTo={location.hash === '#date-header'}
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
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};
UnconnectedResourcePage = injectT(UnconnectedResourcePage);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchResource,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedResourcePage };
export default connect(resourcePageSelector, mapDispatchToProps)(UnconnectedResourcePage);
