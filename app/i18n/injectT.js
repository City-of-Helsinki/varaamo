import React, { Component } from 'react';
import { intlShape } from 'react-intl';

function injectT(WrappedComponent) {
  function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
  }

  class InjectT extends Component {
    constructor(props, context) {
      super(props, context);
      this.t = this.t.bind(this);
    }

    t(id, values = {}) {
      return this.context.intl.formatMessage({ id }, values);
    }

    render() {
      return <WrappedComponent {...this.props} t={this.t} />;
    }
  }

  InjectT.contextTypes = {
    intl: intlShape,
  };

  InjectT.displayName = `InjectT(${getDisplayName(WrappedComponent)})`;

  return InjectT;
}

export default injectT;
