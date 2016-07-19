import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import { clearSearchResults } from 'actions/searchActions';
import { fetchUser } from 'actions/userActions';
import Footer from 'components/layout/Footer';
import Navbar from 'components/layout/Navbar';
import Notifications from 'containers/Notifications';
import appSelector from 'selectors/containers/appSelector';
import { renderStyleCustomizations } from 'utils/CustomizationUtils';

export class UnconnectedApp extends Component {
  componentDidMount() {
    if (this.props.userId) {
      this.props.actions.fetchUser(this.props.userId);
    }
  }

  render() {
    const {
      actions,
      children,
      isLoggedIn,
      user,
    } = this.props;

    return (
      <DocumentTitle title="Varaamo">
        <div className="app">
          {renderStyleCustomizations()}
          <Navbar
            clearSearchResults={actions.clearSearchResults}
            isLoggedIn={isLoggedIn}
            user={user}
          />
          <div className="app-content">
            <Grid>
              <Notifications />
              {children}
            </Grid>
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedApp.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.node,
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  userId: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    clearSearchResults,
    fetchUser,
    updatePath,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(appSelector, mapDispatchToProps)(UnconnectedApp);
