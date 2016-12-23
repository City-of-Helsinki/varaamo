import React, { Component, PropTypes } from 'react';
import Table from 'react-bootstrap/lib/Table';
import { connect } from 'react-redux';

import CommentModal from 'shared/modals/comment';
import { injectT } from 'i18n';
import { getOpenReservations } from 'utils/resourceUtils';
import { getCurrentReservation, getNextReservation } from 'utils/reservationUtils';
import ResourcesTableRow from './ResourcesTableRow';

class UnconnectedResourcesTable extends Component {
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
    const { resources, t } = this.props;
    return (
      <div>
        <Table className="resources-table" responsive striped>
          <thead>
            <tr>
              <th>{t('ResourcesTable.nameHeader')}</th>
              <th>{t('ResourcesTable.availabilityHeader')}</th>
              <th>{t('ResourcesTable.reservationHeader')}</th>
              <th>{t('ResourcesTable.reserverHeader')}</th>
              <th>{t('ResourcesTable.commentsHeader')}</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(this.renderResourcesTableRow)}
          </tbody>
        </Table>
        <CommentModal />
      </div>
    );
  }
}

UnconnectedResourcesTable.propTypes = {
  resources: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

UnconnectedResourcesTable = injectT(UnconnectedResourcesTable);  // eslint-disable-line

export { UnconnectedResourcesTable };
export default connect()(UnconnectedResourcesTable);
