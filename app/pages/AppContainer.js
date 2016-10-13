import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { clearSearchResults } from 'actions/searchActions';
import { fetchUser } from 'actions/userActions';
import Favicon from 'shared/favicon';
import Footer from 'shared/footer';
import Navbar from 'shared/navbar';
import Notifications from 'shared/notifications';
import { getCustomizationClassName } from 'utils/customizationUtils';
import appSelector from './appSelector';

export class UnconnectedAppContainer extends Component {
  getChildContext() {
    return {
      location: this.props.location,
    };
  }

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

UnconnectedAppContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  children: PropTypes.node,
  isAdmin: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  userId: PropTypes.string,
};

UnconnectedAppContainer.childContextTypes = {
  location: React.PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    clearSearchResults,
    fetchUser,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(appSelector, mapDispatchToProps)(UnconnectedAppContainer);
