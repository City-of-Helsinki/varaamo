import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';

import { fetchResource } from 'actions/resourceActions';
import { clearReservations, toggleResourceMap } from 'actions/uiActions';
import PageWrapper from 'pages/PageWrapper';
import NotFoundPage from 'pages/not-found/NotFoundPage';
import ResourceCalendar from 'shared/resource-calendar';
import ResourceMap from 'shared/resource-map';
import { injectT } from 'i18n';
import { getMaxPeriodText, getResourcePageUrl } from 'utils/resourceUtils';
import ReservationCalendar from './reservation-calendar';
import ResourceHeader from './resource-header';
import ResourceInfo from './resource-info';
import ResourceMapInfo from './resource-map-info';
import resourcePageSelector from './resourcePageSelector';

class UnconnectedResourcePage extends Component {
  constructor(props) {
    super(props);
    this.fetchResource = this.fetchResource.bind(this);
  }

  componentDidMount() {
    this.props.actions.clearReservations();
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
    browserHistory.replace(getResourcePageUrl(resource, day));
  }

  handleBackButton() {
    browserHistory.goBack();
  }

  orderImages(images) {
    return [].concat(
      images.filter(image => image.type === 'main'),
      images.filter(image => image.type !== 'main'),
    );
  }

  render() {
    const {
      actions,
      date,
      isFetchingResource,
      isLoggedIn,
      location,
      params,
      resource,
      showMap,
      t,
      unit,
    } = this.props;

    if (isEmpty(resource) && !isFetchingResource) {
      return <NotFoundPage />;
    }

    const maxPeriodText = getMaxPeriodText(t, resource);

    const images = this.orderImages(resource.images || []);

    return (
      <div className="app-ResourcePage">
        <Loader loaded={!isEmpty(resource)}>
          <ResourceHeader
            isLoggedIn={isLoggedIn}
            onBackClick={this.handleBackButton}
            onMapClick={actions.toggleResourceMap}
            resource={resource}
            showMap={showMap}
            unit={unit}
          />
          {showMap && unit &&
            <ResourceMapInfo
              resource={resource}
              unit={unit}
            />
          }
          {showMap &&
            <ResourceMap
              location={location}
              resourceIds={[resource.id]}
              selectedUnitId={unit ? unit.id : null}
              showMap={showMap}
            />
          }
          {!showMap &&
            <PageWrapper title={resource.name || ''} transparent>
              <div>
                <Col className="app-ResourcePage__content" lg={8} md={8} xs={12}>
                  <ResourceInfo
                    isLoggedIn={isLoggedIn}
                    resource={resource}
                    unit={unit}
                  />

                  <Panel collapsible defaultExpanded header={t('ResourceInfo.reserveTitle')}>
                    {`${t('ReservationInfo.reservationMaxLength')} ${maxPeriodText}`}
                    <ResourceCalendar
                      onDateChange={this.handleDateChange}
                      resourceId={resource.id}
                      selectedDate={date}
                    />
                    <ReservationCalendar
                      location={location}
                      params={params}
                    />
                  </Panel>
                </Col>

                <Col className="app-ResourceInfo__imgs-wrapper" lg={3} md={3} xs={12}>
                  {images.map(image => (
                    <div className="app-ResourceInfo__image-wrapper" key={image.url}>
                      <img alt={image.caption} className="app-ResourceInfo__image" src={image.url} />
                    </div>
                  ))}
                </Col>

              </div>
            </PageWrapper>
          }
        </Loader>
      </div>
    );
  }
}

UnconnectedResourcePage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  showMap: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};
UnconnectedResourcePage = injectT(UnconnectedResourcePage);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    clearReservations,
    fetchResource,
    toggleResourceMap,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedResourcePage };
export default connect(resourcePageSelector, mapDispatchToProps)(UnconnectedResourcePage);
