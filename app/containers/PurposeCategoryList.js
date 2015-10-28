import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { pushState } from 'redux-router';

import { fetchPurposes } from 'actions/purposeActions';
import PurposeCategory from 'components/purpose/PurposeCategory';
import purposeCategoryListSelector from 'selectors/containers/purposeCategoryListSelector';

export class UnconnectedPurposeCategoryList extends Component {
  constructor(props) {
    super(props);
    this.onItemClick = this.onItemClick.bind(this);
    this.renderPurposeCategory = this.renderPurposeCategory.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  onItemClick(filters) {
    const { actions } = this.props;
    actions.pushState(null, '/search', filters);
  }

  renderPurposeCategory(mainType) {
    const purposes = this.props.purposeCategories[mainType];

    return (
      <PurposeCategory
        key={mainType}
        mainType={mainType}
        onItemClick={this.onItemClick}
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
    pushState,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(purposeCategoryListSelector, mapDispatchToProps)(UnconnectedPurposeCategoryList);
