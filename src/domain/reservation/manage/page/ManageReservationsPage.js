import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Loader from 'react-loader';
import { withRouter } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import PageWrapper from '../../../../../app/pages/PageWrapper';
import injectT from '../../../../../app/i18n/injectT';
import client from '../../../../common/api/client';
import { createNotification } from '../../../../common/notification/utils';
import ManageReservationsFilters from '../filters/ManageReservationsFilters';
import ManageReservationsList from '../list/ManageReservationsList';
import { NOTIFICATION_TYPE } from '../../../../common/notification/constants';
import Pagination from '../../../../common/pagination/Pagination';
import * as searchUtils from '../../../search/utils';
import { selectReservationToEdit } from '../../../../../app/actions/uiActions';
import * as reservationUtils from '../../utils';
import { RESERVATION_STATE } from '../../../../constants/ReservationState';
import ReservationInformationModal from '../../modal/ReservationInformationModal';
import { RESERVATION_SHOWONLY_FILTERS } from '../../constants';
import { userFavouriteResourcesSelector } from '../../../../../app/state/selectors/dataSelectors';
import ConnectedReservationCancelModal from '../../modal/ReservationCancelModal';

export const PAGE_SIZE = 50;

class ManageReservationsPage extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.object,
    location: PropTypes.object,
    actions: PropTypes.object,
    userFavoriteResources: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isLoadingUnits: false,
      reservations: [],
      units: [],
      totalCount: 0,
      isModalOpen: false,
      selectedReservation: {},
      showOnlyFilters: [RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY],
      isReservationCancelModalOpen: false,
    };
  }

  componentDidMount() {
    this.loadUnits();
    this.loadReservations();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (prevProps.location !== location) {
      this.loadReservations();
    }
  }

  loadReservations = () => {
    const {
      location,
    } = this.props;

    this.setState({
      isLoading: true,
      isModalOpen: false,
      // Close modal when refetch
    });

    const filters = searchUtils.getFiltersFromUrl(location, false);
    const params = {
      ...filters,
      page_size: PAGE_SIZE,
      include: 'resource_detail',
    };

    client.get('reservation', params)
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          reservations: get(data, 'results', []),
          totalCount: get(data, 'count', 0),
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

  onSearchFiltersChange = (filters) => {
    const { history } = this.props;

    history.push({
      search: searchUtils.getSearchFromFilters(filters),
    });
  };

  onShowOnlyFiltersChange = (filters) => {
    this.setState({
      showOnlyFilters: filters,
    });
  }

  onEditClick = (reservation) => {
    const { history, actions } = this.props;


    const normalizedReservation = Object.assign({}, reservation, { resource: reservation.resource.id });
    actions.editReservation({ reservation: normalizedReservation });
    // TODO: Remove this after refactor timeSlot

    const nextUrl = `${reservationUtils.getEditReservationUrl(reservation)}&path=manage-reservations`;
    history.push(nextUrl);
  };

  onInfoClick = (reservation) => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
      selectedReservation: reservation,
    }));
  }

  // The same function is passed to ManageReservationsList, ReservationInformationModal AND ReservationCancelModal!!!
  onEditReservation = async (reservation, status, openReservationCancelModal = false) => {
    try {
      if (status === RESERVATION_STATE.CANCELLED) {
        if (openReservationCancelModal) {
          // We are calling ReservationCancelModal via ManageReservationsList.
          await this.setState((prevState) => {
            return {
              isReservationCancelModalOpen: !prevState.isReservationCancelModalOpen,
              selectedReservation: reservation,
            };
          });
        } else {
          // We are calling ReservationCancelModal via ReservationInformationModal.
          await reservationUtils.cancelReservation(reservation);
          // We need to close the ReservationCancelModal.
          this.parentToggle(false);
        }
      } else {
        await reservationUtils.putReservation(reservation, { state: status });
      }
      this.loadReservations();
    } catch (error) {
      // We show the error message from respa to staff because it helps with support and debugging.
      createNotification(NOTIFICATION_TYPE.ERROR, error.message);
    }
  }

  onSaveComment = async (reservation, comments) => {
    try {
      await reservationUtils.putReservation(reservation, { resource: reservation.resource.id, comments });
      this.loadReservations();
    } catch (error) {
      // We show the error message from respa to staff because it helps with support and debugging.
      createNotification(NOTIFICATION_TYPE.ERROR, error.message);
    }
  };

  /**
   * Filter list of reservations based on selected SHOW_ONLY filters.
   * By default return all fetched reservations
   *
   * @memberof ManageReservationsPage
  */

  getFilteredReservations = (filters) => {
    const { reservations } = this.state;
    const { userFavoriteResources } = this.props;

    const favoriteResourceFilter = reservation => userFavoriteResources
      && userFavoriteResources.includes(reservation.resource.id);

    const canModifyFilter = reservation => reservationUtils.canUserModifyReservation(reservation);

    if (isEmpty(filters) || !Array.isArray(filters)) {
      return reservations;
    }

    // Both options selected
    if (filters.length > 1) {
      return reservations.filter(reservation => canModifyFilter(reservation) && favoriteResourceFilter(reservation));
    }

    if (filters.includes(RESERVATION_SHOWONLY_FILTERS.FAVORITE)) {
      return reservations.filter(favoriteResourceFilter);
    }

    if (filters.includes(RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY)) {
      return reservations.filter(canModifyFilter);
    }

    return reservations;
  }

  parentToggle = (bool) => {
    this.setState(() => ({
      isReservationCancelModalOpen: bool,
    }));
  }

  render() {
    const {
      t,
      history,
      location,
    } = this.props;

    const {
      isLoading,
      isLoadingUnits,
      units,
      totalCount,
      isModalOpen,
      selectedReservation,
      showOnlyFilters,
      isReservationCancelModalOpen,
    } = this.state;
    const filters = searchUtils.getFiltersFromUrl(location, false);
    const title = t('ManageReservationsPage.title');

    return (
      <div className="app-ManageReservationsPage">
        <div className="app-ManageReservationsPage__filters">
          <Grid>
            <Row>
              <Col sm={12}>
                <h1>{title}</h1>
              </Col>
            </Row>
          </Grid>
          <ManageReservationsFilters
            filters={filters}
            onSearchChange={this.onSearchFiltersChange}
            onShowOnlyFiltersChange={this.onShowOnlyFiltersChange}
            showOnlyFilters={showOnlyFilters}
            units={units}
          />
          <Grid>
            <Row>
              <Col sm={12}>
                <span>
                  {totalCount > 0
                    ? t('ManageReservationsPage.searchResults', { count: totalCount })
                    : t('ManageReservationsPage.noSearchResults')
                  }
                </span>
              </Col>
            </Row>
          </Grid>

        </div>
        <div className="app-ManageReservationsPage__list">
          <PageWrapper title={title}>
            <Row>
              <Col sm={12}>
                <Loader loaded={!isLoading && !isLoadingUnits}>
                  <ManageReservationsList
                    onEditClick={this.onEditClick}
                    onEditReservation={this.onEditReservation}
                    onInfoClick={this.onInfoClick}
                    reservations={this.getFilteredReservations(showOnlyFilters)}
                  />
                </Loader>
                <Pagination
                  onChange={newPage => history.push({
                    search: searchUtils.getSearchFromFilters({ ...filters, page: newPage }),
                  })}
                  page={filters && filters.page ? Number(filters.page) : 1}
                  pages={Math.round(totalCount / PAGE_SIZE)}
                />
              </Col>
            </Row>
          </PageWrapper>
        </div>
        {isModalOpen && (
          <div className="app-ManageReservationsPage__modal">
            <ReservationInformationModal
              isOpen={isModalOpen}
              onEditClick={this.onEditClick}
              onEditReservation={this.onEditReservation}
              onHide={this.onInfoClick}
              onSaveComment={this.onSaveComment}
              reservation={selectedReservation}
            />
          </div>
        )}
        {isReservationCancelModalOpen && (
          <ConnectedReservationCancelModal
            onEditReservation={this.onEditReservation}
            parentToggle={this.parentToggle}
            reservation={selectedReservation}
            toggleShow={isReservationCancelModalOpen}
          />
        )}
      </div>
    );
  }
}

export const UnwrappedManageReservationsPage = injectT(ManageReservationsPage);

const selector = createStructuredSelector({
  userFavoriteResources: userFavouriteResourcesSelector,
});

const mapDispatchToProps = (dispatch) => {
  const actionCreators = {
    editReservation: selectReservationToEdit,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
};

export default connect(selector, mapDispatchToProps)(withRouter(UnwrappedManageReservationsPage));
