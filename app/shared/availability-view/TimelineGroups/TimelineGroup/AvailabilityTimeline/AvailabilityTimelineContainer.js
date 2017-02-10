import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// import uiActions from 'actions/uiActions';
import AvailabilityTimeline from './AvailabilityTimeline';
import utils from '../utils';

export function selector() {
  function dateSelector(state, props) { return props.date; }
  function resourceIdSelector(state, props) { return props.id; }
  function resourcesSelector(state) { return state.data.resources; }

  const resourceSelector = createSelector(
    resourcesSelector,
    resourceIdSelector,
    (resources, id) => resources[id]
  );
  const reservationsSelector = createSelector(
    resourceSelector,
    dateSelector,
    (resource, date) => resource.reservations && sortBy(
      resource.reservations.filter(reservation => reservation.begin.slice(0, 10) === date),
      'begin'
    )
  );
  const itemsSelector = createSelector(
    reservationsSelector,
    dateSelector,
    resourceIdSelector,
    (reservations, date, resourceId) =>
      utils.getTimelineItems(moment(date), reservations, resourceId)
  );

  return createSelector(
    itemsSelector,
    items => ({ items })
  );
}

const actions = {
  onReservationClick: () => null, // uiActions.showReservationInfoModal,
};

const AvailabilityTimelineContainer = connect(selector, actions)(AvailabilityTimeline);
AvailabilityTimelineContainer.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onReservationSlotClick: PropTypes.func,
  selection: PropTypes.object,
};

export default AvailabilityTimelineContainer;
