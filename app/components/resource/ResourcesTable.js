import React, { Component, PropTypes } from 'react';
import Table from 'react-bootstrap/lib/Table';
import { connect } from 'react-redux';

import ResourcesTableItem from 'components/resource/ResourcesTableItem';
import { getCurrentReservation, getNextReservation } from 'utils/reservationUtils';

export class UnconnectedResourcesTable extends Component {
  renderResourcesTableItem(resource) {
    return (
      <ResourcesTableItem
        key={resource.id}
        currentReservation={getCurrentReservation(resource.reservations)}
        nextReservation={getNextReservation(resource.reservations)}
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
            {resources.map(this.renderResourcesTableItem)}
          </tbody>
        </Table>
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
