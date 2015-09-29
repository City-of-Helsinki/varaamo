import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import ImmutablePropTypes from 'react-immutable-proptypes';
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
    const name = resource.getIn(['name', 'fi']);
    return (
      <DocumentTitle title={`${name} - Respa`}>
        <Loader loaded={Boolean(resource.size)}>
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
  resource: ImmutablePropTypes.map.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ fetchResource }, dispatch) };
}

export default connect(resourcePageSelectors, mapDispatchToProps)(UnconnectedResourcePage);
