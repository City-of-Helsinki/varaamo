import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateRoute } from '../../actions/routeActions';
import userIdSelector from '../../state/selectors/userIdSelector';

export class UnconnectedPrivateRoute extends Component {
  constructor(props) {
    super(props);

    this.renderOrRedirect = this.renderOrRedirect.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.actions.updateRoute(this.props.location);
  }

  componentDidUpdate() {
    this.props.actions.updateRoute(this.props.location);
  }

  renderOrRedirect(routerProps) {
    const { userId, component: RouteComponent } = this.props;

    if (userId) {
      return <RouteComponent {...routerProps} />;
    }
    return window.location.replace(`${window.location.origin}/login`);
  }

  render() {
    const { component, ...rest } = this.props; // eslint-disable-line no-unused-vars

    return <Route {...rest} render={this.renderOrRedirect} />;
  }
}

UnconnectedPrivateRoute.propTypes = {
  actions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  userId: PropTypes.string,
  component: PropTypes.func.isRequired,
  componentName: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export const mapStateToProps = state => ({
  userId: userIdSelector(state),
});

export const mapDispatchToProps = (dispatch, ownProps) => {
  const actionCreators = {
    updateRoute: updateRoute(ownProps.componentName),
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedPrivateRoute);
