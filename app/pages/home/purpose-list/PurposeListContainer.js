import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchPurposes } from 'actions/purposeActions';
import PurposeList from './PurposeList';
import selector from './purposeListSelector';

export class UnconnectedPurposeListContainer extends Component {
  componentDidMount() {
    this.props.actions.fetchPurposes();
  }

  render() {
    const { isFetchingPurposes, purposes } = this.props;

    return (
      <Loader loaded={!isFetchingPurposes}>
        <PurposeList purposes={purposes} />
      </Loader>
    );
  }
}

UnconnectedPurposeListContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingPurposes: PropTypes.bool.isRequired,
  purposes: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchPurposes,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default (
  connect(selector, mapDispatchToProps)(UnconnectedPurposeListContainer)
);
