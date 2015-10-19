import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';

import styles from './Footer.styles';

export class Footer extends Component {
  render() {
    return (
      <footer style={styles.footer}>
        <Grid>
          <p>Add footer content here.</p>
        </Grid>
      </footer>
    );
  }
}

Footer.propTypes = {};

export default Footer;
