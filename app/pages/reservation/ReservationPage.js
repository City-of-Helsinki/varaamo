import { first, isEmpty, last } from 'lodash';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import { postReservation, putReservation } from 'actions/reservationActions';
import { fetchResource } from 'actions/resourceActions';
import {
  clearReservations,
  closeReservationSuccessModal,
  openResourceTermsModal,
} from 'actions/uiActions';
import PageWrapper from 'pages/PageWrapper';
import { injectT } from 'i18n';
import ReservationConfirmation from './reservation-confirmation/ReservationConfirmation';
import ReservationInformation from './reservation-information/ReservationInformation';
import ReservationPhases from './reservation-phases/ReservationPhases';
import ReservationTime from './reservation-time/ReservationTime';
import reservationPageSelector from './reservationPageSelector';

class UnconnectedReservationPage extends Component {
  constructor(props) {
    super(props);
    this.fetchResource = this.fetchResource.bind(this);
    const { reservationToEdit } = this.props;
    this.state = {
      view: !isEmpty(reservationToEdit) ? 'time' : 'information',
    };
  }

  componentDidMount() {
    const {
      location,
      reservationCreated,
      reservationEdited,
      reservationToEdit,
      selected,
    } = this.props;
    if (isEmpty(reservationCreated) && isEmpty(reservationEdited) &&
      isEmpty(reservationToEdit) && isEmpty(selected)) {
      if (location.query && !location.query.id && location.query.resource) {
        browserHistory.replace(`/resources/${location.query.resource}`);
      } else {
        browserHistory.replace('/my-reservations');
      }
    } else {
      this.fetchResource();
      window.scrollTo(0, 0);
    }
  }

  componentWillUpdate(nextProps) {
    const {
      reservationCreated: nextCreated,
      reservationEdited: nextEdited,
    } = nextProps;
    const {
      reservationCreated,
      reservationEdited,
    } = this.props;
    if ((!isEmpty(nextCreated) || !isEmpty(nextEdited)) &&
      (nextCreated !== reservationCreated || nextEdited !== reservationEdited)) {
      this.setState({
        view: 'confirmation',
      });
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    this.props.actions.clearReservations();
    this.props.actions.closeReservationSuccessModal();
  }

  fetchResource() {
    const { actions, date, resource } = this.props;
    if (!isEmpty(resource)) {
      const start = moment(date).subtract(2, 'M').startOf('month').format();
      const end = moment(date).add(2, 'M').endOf('month').format();
      actions.fetchResource(resource.id, { start, end });
    }
  }

  handleBack = () => {
    if (!isEmpty(this.props.reservationToEdit)) {
      this.setState({ view: 'time' });
      window.scrollTo(0, 0);
    }
  }

  handleCancel = () => {
    const { reservationToEdit, resource } = this.props;
    if (!isEmpty(reservationToEdit)) {
      browserHistory.replace('/my-reservations');
    } else {
      browserHistory.replace(`/resources/${resource.id}`);
    }
  }

  handleConfirmTime = () => {
    this.setState({ view: 'information' });
    window.scrollTo(0, 0);
  }

  handleReservation = (values = {}) => {
    const { actions, reservationToEdit, resource, selected } = this.props;
    if (!isEmpty(selected)) {
      const { begin } = first(selected);
      const { end } = last(selected);

      if (!isEmpty(reservationToEdit)) {
        const reservation = Object.assign({}, reservationToEdit);
        actions.putReservation({
          ...reservation,
          ...values,
          begin,
          end,
        });
      } else {
        actions.postReservation({
          ...values,
          begin,
          end,
          resource: resource.id,
        });
      }
    }
  }

  render() {
    const {
      actions,
      isAdmin,
      isStaff,
      isFetchingResource,
      isMakingReservations,
      location,
      params,
      reservationCreated,
      reservationEdited,
      reservationToEdit,
      resource,
      selected,
      t,
      unit,
      user,
    } = this.props;
    const { view } = this.state;

    if (isEmpty(resource) && isEmpty(reservationCreated) &&
      isEmpty(reservationEdited) && isEmpty(reservationToEdit) && !isFetchingResource) {
      return <div />;
    }

    const isEditing = !isEmpty(reservationToEdit);
    const isEdited = !isEmpty(reservationEdited);
    const begin = !isEmpty(selected) ? first(selected).begin : null;
    const end = !isEmpty(selected) ? last(selected).end : null;
    const selectedTime = begin && end ? { begin, end } : null;
    const title = t(`ReservationPage.${isEditing || isEdited ? 'editReservationTitle' : 'newReservationTitle'}`);

    return (
      <div className="app-ReservationPage">
        <PageWrapper title={title} transparent>
          <div>
            <div className="app-ReservationPage__content">
              <h1>{title}</h1>
              <Loader loaded={!isEmpty(resource)}>
                <ReservationPhases
                  currentPhase={view}
                  isEditing={isEditing || isEdited}
                />
                {view === 'time' && isEditing &&
                  <ReservationTime
                    location={location}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleConfirmTime}
                    params={params}
                    resource={resource}
                    selectedReservation={reservationToEdit}
                    unit={unit}
                  />
                }
                {view === 'information' && selectedTime &&
                  <ReservationInformation
                    isAdmin={isAdmin}
                    isEditing={isEditing}
                    isMakingReservations={isMakingReservations}
                    isStaff={isStaff}
                    onBack={this.handleBack}
                    onCancel={this.handleCancel}
                    onConfirm={this.handleReservation}
                    openResourceTermsModal={actions.openResourceTermsModal}
                    reservation={reservationToEdit}
                    resource={resource}
                    selectedTime={selectedTime}
                    unit={unit}
                  />
                }
                {view === 'confirmation' && (reservationCreated || reservationEdited) &&
                  <ReservationConfirmation
                    isEdited={isEdited}
                    reservation={reservationCreated || reservationEdited}
                    resource={resource}
                    user={user}
                  />
                }
              </Loader>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }
}

UnconnectedReservationPage.propTypes = {
  actions: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  reservationToEdit: PropTypes.object,
  reservationCreated: PropTypes.object,
  reservationEdited: PropTypes.object,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};
UnconnectedReservationPage = injectT(UnconnectedReservationPage);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    clearReservations,
    closeReservationSuccessModal,
    fetchResource,
    openResourceTermsModal,
    putReservation,
    postReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedReservationPage };
export default connect(reservationPageSelector, mapDispatchToProps)(UnconnectedReservationPage);
