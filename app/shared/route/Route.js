import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route as ReactRouterRoute } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateRoute } from 'actions/routeActions';

export class UnconnectedRoute extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.actions.updateRoute(this.props.location);
  }

  componentDidUpdate() {
    this.props.actions.updateRoute(this.props.location);
  }

  render() {
    return <ReactRouterRoute {...this.props} />;
  }
}

UnconnectedRoute.propTypes = {
  actions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  componentName: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export const mapDispatchToProps = (dispatch, ownProps) => {
  const actionCreators = {
    updateRoute: updateRoute(ownProps.componentName),
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
};

export default connect(
  null,
  mapDispatchToProps,
)(UnconnectedRoute);
