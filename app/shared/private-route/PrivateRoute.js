import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { createAction } from 'redux-actions';
import { connect } from 'react-redux';

import userIdSelector from 'state/selectors/userIdSelector';

class PrivateRoute extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.updateRoute();
  }

  componentDidUpdate() {
    this.props.updateRoute();
  }

  render() {
    const { userId, component: RouteComponent, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={(props) => {
          if (userId) {
            return <RouteComponent {...props} />;
          }
          return window.location.replace(`${window.location.origin}/login`);
        }}
      />
    );
  }
}

PrivateRoute.propTypes = {
  updateRoute: PropTypes.func.isRequired,
  userId: PropTypes.string,
  component: PropTypes.element.isRequired,
  componentName: PropTypes.string.isRequired,
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
)(PrivateRoute);
