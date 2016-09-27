import React, { PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';

function PageWrapper({ children, className, title }) {
  return (
    <Grid>
      <DocumentTitle title={`${title} - Varaamo`} />
      <div className={className}>
        {children}
      </div>
    </Grid>
  );
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default PageWrapper;
