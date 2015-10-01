import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import { resourcePageSelectors } from 'selectors/resourcePageSelectors';

export class UnconnectedResourcePage extends Component {
  componentDidMount() {
    const { actions, id } = this.props;
    actions.fetchResource(id);
  }

  render() {
    const { resource } = this.props;
    const name = resource.name ? resource.name.fi : '';

    return (
      <DocumentTitle title={`${name} - Respa`}>
        <Loader loaded={!_.isEmpty(resource)}>
          <div>
            <h1>{name}</h1>
          </div>
        </Loader>
      </DocumentTitle>
    );
  }
}

UnconnectedResourcePage.propTypes = {
  actions: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ fetchResource }, dispatch) };
}

export default connect(resourcePageSelectors, mapDispatchToProps)(UnconnectedResourcePage);
