import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { createAction } from 'redux-actions';
import { connect } from 'react-redux';

import userIdSelector from 'state/selectors/userIdSelector';

export class UnconnectedPrivateRoute extends Component {
  constructor(props) {
    super(props);

    this.renderOrRedirect = this.renderOrRedirect.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateRoute();
  }

  componentDidUpdate() {
    this.props.updateRoute();
  }

  renderOrRedirect(routerProps) {
    const { userId, component: RouteComponent } = this.props;

    if (userId) {
      return <RouteComponent {...routerProps} />;
    }
    return window.location.replace(`${window.location.origin}/login`);
  }

  render() {
    return <Route {...this.props} render={this.renderOrRedirect} />;
  }
}

UnconnectedPrivateRoute.propTypes = {
  updateRoute: PropTypes.func.isRequired,
  userId: PropTypes.string,
  component: PropTypes.func.isRequired,
  componentName: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

const mapStateToProps = state => ({
  userId: userIdSelector(state),
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const routeChangedAction = createAction(
    `ENTER_OR_CHANGE_${ownProps.componentName.toUpperCase()}_PAGE`
  );

  return { updateRoute: () => dispatch(routeChangedAction(ownProps.location)) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedPrivateRoute);
