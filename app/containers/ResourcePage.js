import React, {Component} from 'react';
import DocumentTitle from 'react-document-title';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';

import {resourcePageSelectors} from 'selectors/resourcePageSelectors';

export class UnconnectedResourcePage extends Component {
  render() {
    const {resource} = this.props;
    const name = resource.getIn(['name', 'fi']);
    return (
      <DocumentTitle title={`${name} - Respa`}>
        <div>
          <h1>{name}</h1>
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedResourcePage.propTypes = {
  resource: ImmutablePropTypes.map.isRequired,
};

export default connect(resourcePageSelectors)(UnconnectedResourcePage);
