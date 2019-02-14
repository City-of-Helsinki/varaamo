import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';

function PageWrapper({
  children, className, fluid = false, title, transparent = false
}) {
  return (
    <div className={classnames('app-PageWrapper', { 'app-PageWrapper__transparent': transparent })}>
      <Grid
        fluid={fluid}
      >
        <DocumentTitle title={`${title} - Varaamo`} />
        <div className={className}>
          {children}
        </div>
      </Grid>
    </div>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fluid: PropTypes.bool,
  title: PropTypes.string.isRequired,
  transparent: PropTypes.bool
};

export default PageWrapper;
