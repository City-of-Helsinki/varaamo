import React, { Component, PropTypes } from 'react';
import { Grid } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';

import Navbar from 'components/layout/Navbar';

class App extends Component {
  render() {
    const { children } = this.props;

    return (
      <DocumentTitle title="Respa">
        <div>
          <Navbar />
          <Grid>
            {children}
          </Grid>
        </div>
      </DocumentTitle>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(App);
