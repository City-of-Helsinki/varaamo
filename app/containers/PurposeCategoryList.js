import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchPurposes } from 'actions/purposeActions';
import PurposeCategory from 'components/purpose/PurposeCategory';
import purposeCategoryListSelector from 'selectors/containers/purposeCategoryListSelector';

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
    const { isFetchingPurposes, purposeCategories } = this.props;

    return (
      <Loader loaded={!isFetchingPurposes}>
        <div>
          {_.map(_.keys(purposeCategories), this.renderPurposeCategory)}
        </div>
      </Loader>
    );
  }
}

UnconnectedPurposeCategoryList.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool.isRequired,
  purposeCategories: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchPurposes,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(purposeCategoryListSelector, mapDispatchToProps)(UnconnectedPurposeCategoryList);
