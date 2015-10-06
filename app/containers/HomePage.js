import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchPurposes } from 'actions/purposeActions';
import PurposeCategoryList from 'components/purpose/PurposeCategoryList';
import { homePageSelectors } from 'selectors/homePageSelectors';

export class UnconnectedHomePage extends Component {
  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  render() {
    const { purposeCategories } = this.props;

    return (
      <DocumentTitle title="Etusivu - Respa">
        <div>
          <h2>Mitä haluat tehdä?</h2>
          <PurposeCategoryList purposeCategories={purposeCategories} />
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedHomePage.propTypes = {
  actions: PropTypes.object.isRequired,
  purposeCategories: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ fetchPurposes }, dispatch) };
}

export default connect(homePageSelectors, mapDispatchToProps)(UnconnectedHomePage);
