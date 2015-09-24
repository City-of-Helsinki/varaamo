import React, {Component, PropTypes} from 'react';
import DocumentTitle from 'react-document-title';
import {connect} from 'react-redux';

class SearchPage extends Component {
  render() {
    const {category} = this.props;

    return (
      <DocumentTitle title='Haku - Respa'>
        <div>
          <h1>Haku</h1>
          <p>Kategoria: {category}</p>
        </div>
      </DocumentTitle>
    );
  }
}

SearchPage.propTypes = {
  category: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    category: state.search.get('category'),
  };
}

export default connect(mapStateToProps)(SearchPage);
