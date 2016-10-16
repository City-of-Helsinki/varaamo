import React, { Component, PropTypes } from 'react';
import Table from 'react-bootstrap/lib/Table';
import { connect } from 'react-redux';

import CommentModal from 'shared/modals/comment';
import { getOpenReservations } from 'utils/resourceUtils';
import { getCurrentReservation, getNextReservation } from 'utils/reservationUtils';
import ResourcesTableRow from './ResourcesTableRow';

export class UnconnectedResourcesTable extends Component {
  renderResourcesTableRow(resource) {
    const reservations = getOpenReservations(resource);
    return (
      <ResourcesTableRow
        currentReservation={getCurrentReservation(reservations)}
        key={resource.id}
        nextReservation={getNextReservation(reservations)}
        resource={resource}
      />
    );
  }

  render() {
    const {
      emptyMessage,
      resources,
    } = this.props;
    return (
      Object.keys(resources).length ? (
        <div>
          <Table className="resources-table" responsive striped>
            <thead>
              <tr>
                <th>Tilan nimi</th>
                <th>Vapaata</th>
                <th>Varaus</th>
                <th>Varaaja</th>
                <th>Kommentit</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(this.renderResourcesTableRow)}
            </tbody>
          </Table>
          <CommentModal />
        </div>
      ) : (
        <p>{emptyMessage || 'Et ole lisännyt vielä yhtään tilaa itsellesi.'}</p>
      )
    );
  }
}

UnconnectedResourcesTable.propTypes = {
  emptyMessage: PropTypes.string,
  resources: PropTypes.array.isRequired,
};

export default connect()(UnconnectedResourcesTable);
