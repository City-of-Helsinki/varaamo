import MobileDetect from 'mobile-detect';
import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchUser } from 'actions/userActions';
import { enableGeoposition } from 'actions/uiActions';
import Favicon from 'shared/favicon';
import TestSiteMessage from 'shared/test-site-message';
import Notifications from 'shared/notifications';
import ResourceMap from 'shared/resource-map';
import SideNavbar from 'shared/side-navbar';
import { getCustomizationClassName } from 'utils/customizationUtils';

const userIdSelector = state => state.auth.userId;
const searchResultIdsSelector = (state, props) => {
  if (props.location.pathname.slice(0, 11) === '/resources/') {
    return [state.ui.resourceMap.resourceId];
  }
  return state.ui.search.results;
};
const showMapSelector = (state, props) => {
  if (props.location.pathname.slice(0, 11) === '/resources/') {
    return state.ui.resourceMap.showMap;
  }
  return state.ui.search.showMap;
};
const selectedUnitIdSelector = (state, props) => {
  if (props.location.pathname.slice(0, 11) === '/resources/') {
    return state.ui.resourceMap.unitId;
  }
  return state.ui.search.unitId;
};

export const selector = createStructuredSelector({
  userId: userIdSelector,
  searchResultIds: searchResultIdsSelector,
  selectedUnitId: selectedUnitIdSelector,
  showMap: showMapSelector,
});

export class UnconnectedAppContainer extends Component {
  constructor(props) {
    super(props);
    const mobileDetect = new MobileDetect(window.navigator.userAgent);
    if (mobileDetect.mobile()) {
      props.enableGeoposition();
    }
  }

  getChildContext() {
    return {
      location: this.props.location,
    };
  }

  componentDidMount() {
    if (this.props.userId) {
      this.props.fetchUser(this.props.userId);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.userId && nextProps.userId !== this.props.userId) {
      this.props.fetchUser(nextProps.userId);
    }
  }

  render() {
    return (
      <DocumentTitle title="Varaamo">
        <div className={`app ${getCustomizationClassName()}`}>
          <SideNavbar>
            <Favicon />
            <TestSiteMessage />
            <div className="app-content">
              <Grid>
                <Notifications />
              </Grid>
              <ResourceMap
                resourceIds={this.props.searchResultIds}
                selectedUnitId={this.props.selectedUnitId}
                showMap={this.props.showMap}
              />
              {this.props.children}
            </div>
          </SideNavbar>
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.node,
  enableGeoposition: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  searchResultIds: PropTypes.array.isRequired,
  selectedUnitId: PropTypes.string,
  showMap: PropTypes.bool.isRequired,
  userId: PropTypes.string,
};

UnconnectedAppContainer.childContextTypes = {
  location: React.PropTypes.object,
};

const actions = { enableGeoposition, fetchUser };

export default connect(selector, actions)(UnconnectedAppContainer);
