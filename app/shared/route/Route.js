import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route as ReactRouterRoute } from 'react-router-dom';
import { createAction } from 'redux-actions';
import { connect } from 'react-redux';

export class UnconnectedRoute extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateRoute();
  }

  componentDidUpdate() {
    this.props.updateRoute();
  }

  render() {
    return <ReactRouterRoute {...this.props} />;
  }
}

UnconnectedRoute.propTypes = {
  updateRoute: PropTypes.func.isRequired,
  componentName: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const routeChangedAction = createAction(
    `ENTER_OR_CHANGE_${ownProps.componentName.toUpperCase()}_PAGE`
  );

  return { updateRoute: () => dispatch(routeChangedAction(ownProps.location)) };
};

export default connect(
  null,
  mapDispatchToProps
)(UnconnectedRoute);
