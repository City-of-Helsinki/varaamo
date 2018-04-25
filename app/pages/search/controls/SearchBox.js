import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

import { injectT } from 'i18n';


class SearchBox extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSearch();
  }

  render() {
    const { t, value } = this.props;
    return (
      <form className="app-SearchBox" onSubmit={this.handleSubmit}>
        <ControlLabel>{t('SearchBox.placeholder')}</ControlLabel>
        <FormControl
          className="app-SearchBox__text-field"
          onChange={this.handleChange}
          type="text"
          value={value}
        />
      </form>
    );
  }
}

export default injectT(SearchBox);
