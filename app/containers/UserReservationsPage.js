import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

class UserReservationsPage extends Component {
  render() {
    return (
      <DocumentTitle title="Omat varaukset - Respa">
        <div>
          <h1>Omat varaukset</h1>
        </div>
      </DocumentTitle>
    );
  }
}

UserReservationsPage.propTypes = {};

export default UserReservationsPage;
