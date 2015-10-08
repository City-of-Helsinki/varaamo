import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchPurposes } from 'actions/purposeActions';
import PurposeCategory from 'components/purpose/PurposeCategory';
import { purposeCategoryListSelectors } from 'selectors/purposeCategoryListSelectors';

export class UnconnectedPurposeCategoryList extends Component {
  constructor(props) {
    super(props);
    this.renderPurposeCategory = this.renderPurposeCategory.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  renderPurposeCategory(mainType) {
    const purposes = this.props.purposeCategories[mainType];

    return (
      <PurposeCategory
        key={mainType}
        mainType={mainType}
        purposes={purposes}
      />
    );
  }

  render() {
    const { purposeCategories } = this.props;

    return (
      <Loader loaded={!_.isEmpty(purposeCategories)}>
        <div>
          {_.map(_.keys(purposeCategories), this.renderPurposeCategory)}
        </div>
      </Loader>
    );
  }
}

UnconnectedPurposeCategoryList.propTypes = {
  actions: PropTypes.object.isRequired,
  purposeCategories: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ fetchPurposes }, dispatch) };
}

export default connect(purposeCategoryListSelectors, mapDispatchToProps)(UnconnectedPurposeCategoryList);
