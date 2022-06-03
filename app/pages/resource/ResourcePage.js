import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Lightbox from 'react-image-lightbox';
import { decamelizeKeys } from 'humps';
import 'react-image-lightbox/style.css';

import { addNotification } from '../../actions/notificationsActions';
import constants from '../../constants/AppConstants';
import { fetchResource } from '../../actions/resourceActions';
import { clearReservations, toggleResourceMap, setSelectedTimeSlots } from '../../actions/uiActions';
import recurringReservations from '../../state/recurringReservations';
import PageWrapper from '../PageWrapper';
import NotFoundPage from '../not-found/NotFoundPage';
import ResourceCalendar from '../../shared/resource-calendar/ResourceCalendar';
import injectT from '../../i18n/injectT';
import { getResourcePageUrl } from '../../utils/resourceUtils';
import { getEditReservationUrl } from '../../utils/reservationUtils';
import ResourceHeader from './resource-header/ResourceHeader';
import ResourceInfo from './resource-info/ResourceInfo';
import ResourceMapInfo from './resource-map-info/ResourceMapInfo';
import resourcePageSelector from './resourcePageSelector';
import ResourceMap from '../../../src/domain/resource/map/ResourceMap';
import ResourceReservationCalendar from '../../../src/domain/resource/reservationCalendar/ResourceReservationCalendar';
// eslint-disable-next-line max-len
import ResourceKeyboardReservation from '../../../src/domain/resource/resourceKeyboardReservation/ResourceKeyboardReservation';
// eslint-disable-next-line max-len
import ResourceReservationButton from '../../../src/domain/resource/resourceReservationButton/ResourceReservationButton';
import ResourcePanel from './resource-info/ResourcePanel';

class UnconnectedResourcePage extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isFetchingResource: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isLargeFontSize: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    showMap: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    photoIndex: 0,
    isOpen: false,
    selected: {
      start: null,
      end: null,
    },
  };

  componentDidMount() {
    // Scroll to top of page if we are on client side.
    if (window) {
      window.scrollTo(0, 0);
    }

    this.props.actions.clearReservations();
    this.fetchResource();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.date !== this.props.date || nextProps.isLoggedIn !== this.props.isLoggedIn) {
      this.fetchResource(nextProps.date);
    }
  }

  getImageThumbnailUrl = (image) => {
    const width = 700;
    const height = 420;

    return `${image.url}?dim=${width}x${height}`;
  };

  isDayReservable = (day) => {
    const { resource: { reservableAfter, reservableBefore } } = this.props;
    const beforeDate = reservableAfter || moment().subtract(0, 'day');
    const lastDate = reservableBefore ? moment(reservableBefore).add(1, 'day') : null;
    if (lastDate) return !moment(day).isBetween(beforeDate, lastDate, 'day');
    return moment(day).isBefore(beforeDate, 'day');
  };

  handleDateChange = (newDate) => {
    const { resource, history } = this.props;
    const day = moment(newDate).format(constants.DATE_FORMAT);
    history.replace(getResourcePageUrl(resource, day));
  };

  handleBackButton = () => {
    this.props.history.goBack();
  };

  handleImageClick = (photoIndex) => {
    this.setState(() => ({ isOpen: true, photoIndex }));
  };

  orderImages = (images) => {
    return [].concat(
      images.filter(image => image.type === 'main'),
      images.filter(image => image.type !== 'main'),
    );
  };

  renderImage = (image, index, { mainImageMobileVisibility = false }) => {
    const isMainImage = image.type === 'main';
    const className = classNames('app-ResourceInfo__image-wrapper', {
      'app-ResourceInfo__image-wrapper--main-image': isMainImage,
      'app-ResourceInfo__image-wrapper--mobile-main-image':
        isMainImage && mainImageMobileVisibility,
    });

    return (
      <div className={className} key={image.url}>
        <button
          className="app-ResourceInfo__image-button"
          onClick={() => this.handleImageClick(index)}
          type="button"
        >
          <img
            alt={image.caption}
            className="app-ResourceInfo__image"
            src={this.getImageThumbnailUrl(image)}
          />
        </button>
      </div>
    );
  };

  fetchResource = (date = this.props.date) => {
    const { actions, id } = this.props;
    let start = moment(date)
      .subtract(1, 'M')
      .startOf('month')
      .toISOString();
    const end = moment(date)
      .add(3, 'M')
      .endOf('month')
      .toISOString();

    if (moment(date).isAfter(moment().add(30, 'days'))) {
      start = moment().subtract(1, 'day').toISOString();
    }

    actions.fetchResource(id, { start, end });
  };

  onReserve = (selected) => {
    const { actions, resource, history } = this.props;

    actions.setSelectedTimeSlots({
      selected,
      resource,
    });

    const startMoment = moment(selected.start);
    const endMoment = moment(selected.end);

    actions.changeRecurringBaseTime({
      begin: startMoment.toISOString(),
      end: endMoment.toISOString(),
      resource: resource.id,
    });

    history.push(getEditReservationUrl({
      begin: startMoment.toISOString(),
      end: endMoment.toISOString(),
      resource: resource.id,
    }));
  };

  handleTimeChange = (selected) => {
    this.setState({
      selected: {
        start: selected.start,
        end: selected.end,
      },
    });
  }

  render() {
    const {
      actions,
      date,
      isFetchingResource,
      isLoggedIn,
      isLargeFontSize,
      isStaff,
      location,
      resource,
      showMap,
      t,
      unit,
    } = this.props;

    const { isOpen, photoIndex, selected } = this.state;

    if (isEmpty(resource) && !isFetchingResource) {
      return <NotFoundPage />;
    }

    const images = this.orderImages(resource.images || []);
    const mainImageIndex = findIndex(images, image => image.type === 'main');
    const mainImage = mainImageIndex != null ? images[mainImageIndex] : null;
    const showBackButton = !!location.state && !!location.state.fromSearchResults;
    const resourceReservationButton = (
      <ResourceReservationButton
        isLoggedIn={isLoggedIn}
        onReserve={this.onReserve}
        resource={resource}
        selected={selected}
        t={t}
      />
    );

    return (
      <div className="app-ResourcePage">
        <Loader loaded={!isEmpty(resource)}>
          <ResourceHeader
            isLoggedIn={isLoggedIn}
            isStaff={isStaff}
            onBackClick={this.handleBackButton}
            onMapClick={actions.toggleResourceMap}
            resource={resource}
            showBackButton={showBackButton}
            showMap={showMap}
            unit={unit}
          />
          {showMap && unit && <ResourceMapInfo unit={unit} />}
          {showMap && (<ResourceMap resource={resource} unit={unit} />)}
          {!showMap && (
            <PageWrapper title={resource.name || ''} transparent>
              <Row className={classNames('app-ResourcePage__columns', {
                'app-ResourcePage__columns--is-large-font-size': isLargeFontSize,
              })}
              >
                <Col lg={8} md={8} xs={12}>
                  <div className="app-ResourcePage__content">
                    {mainImage
                    && this.renderImage(mainImage, mainImageIndex, {
                      mainImageMobileVisibility: true,
                    })}
                    <ResourceInfo
                      isLoggedIn={isLoggedIn}
                      resource={resource}
                      unit={unit}
                    />

                    <ResourcePanel header={t('ResourceInfo.reserveTitle')}>
                      <>
                        {resource.externalReservationUrl && (
                        <form action={resource.externalReservationUrl}>
                          <input
                            className="btn btn-primary"
                            type="submit"
                            value="Siirry ulkoiseen ajanvarauskalenteriin"
                          />
                        </form>
                        )}
                        {!resource.externalReservationUrl && (
                        <div>
                          {window.innerWidth < 768 && (
                            <React.Fragment>
                              <div className="app-ResourcePage__content-selection-directions">
                                {t('ReservationInfo.selectionStartDirections')}
                              </div>
                              <div className="app-ResourcePage__content-selection-directions">
                                {t('ReservationInfo.selectionEditDirections')}
                              </div>
                            </React.Fragment>
                          )
                          }

                          <ResourceCalendar
                            isDayReservable={this.isDayReservable}
                            onDateChange={this.handleDateChange}
                            resourceId={resource.id}
                            selectedDate={date}
                          />
                          <div className="app-ResourcePage__keyboard-reservation">
                            <ResourceKeyboardReservation
                              onDateChange={this.handleDateChange}
                              onTimeChange={this.handleTimeChange}
                              resource={resource}
                              selectedDate={date}
                              selectedTime={selected}
                            />
                            {resourceReservationButton}
                          </div>
                          <ResourceReservationCalendar
                            date={date}
                            isStaff={isStaff}
                            onDateChange={newDate => this.handleDateChange(moment(newDate).toDate())}
                            onTimeChange={this.handleTimeChange}
                            resource={decamelizeKeys(resource)}
                          />
                          {resourceReservationButton}
                        </div>
                        )}
                      </>
                    </ResourcePanel>
                  </div>
                </Col>
                <Col lg={3} md={3} xs={12}>
                  <div className="app-ResourceInfo__images">
                    {images.map(this.renderImage)}
                  </div>
                </Col>
              </Row>

            </PageWrapper>
          )}
        </Loader>

        <div>
          {isOpen && (
            <Lightbox
              imageCaption={images[photoIndex].caption}
              mainSrc={images[photoIndex].url}
              nextSrc={images[(photoIndex + 1) % images.length].url}
              onCloseRequest={() => this.setState(() => ({ isOpen: false }))}
              onMoveNextRequest={() => this.setState(state => ({
                photoIndex: (state.photoIndex + 1) % images.length,
              }))
              }
              onMovePrevRequest={() => this.setState(state => ({
                photoIndex: (state.photoIndex + (images.length - 1)) % images.length,
              }))
              }
              prevSrc={images[(photoIndex + (images.length - 1)) % images.length].url}
              reactModalStyle={{ overlay: { zIndex: 2000 } }}
            />
          )}
        </div>
      </div>
    );
  }
}

UnconnectedResourcePage = injectT(UnconnectedResourcePage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    clearReservations,
    fetchResource,
    toggleResourceMap,
    setSelectedTimeSlots,
    changeRecurringBaseTime: recurringReservations.changeBaseTime,
    addNotification,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedResourcePage };
export default connect(
  resourcePageSelector,
  mapDispatchToProps,
)(UnconnectedResourcePage);
