import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePath } from 'redux-simple-router';

import { clearSearchResults } from 'actions/searchActions';
import { fetchUser } from 'actions/userActions';
import Notifications from 'containers/Notifications';
import appSelector from 'selectors/containers/appSelector';
import Favicon from 'shared/favicon';
import Footer from 'shared/footer';
import Navbar from 'shared/navbar';
import { getCustomizationClassName } from 'utils/customizationUtils';

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
      isAdmin,
      isLoggedIn,
      user,
    } = this.props;

    return (
      <DocumentTitle title="Varaamo">
        <div className={`app ${getCustomizationClassName()}`}>
          <Favicon />
          <Navbar
            clearSearchResults={actions.clearSearchResults}
            isAdmin={isAdmin}
            isLoggedIn={isLoggedIn}
            user={user}
          />
          <div className="app-content">
            <Grid>
              <Notifications />
            </Grid>
            {children}
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
  isAdmin: PropTypes.bool.isRequired,
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
