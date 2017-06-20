import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
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
        <FormControl
          className="app-SearchBox__text-field"
          onChange={this.handleChange}
          placeholder={t('SearchBox.placeholder')}
          type="text"
          value={value}
        />
        <div className="app-SearchBox__divider" />
        <Button
          className="app-SearchBox__button"
          type="submit"
        >
          {t('SearchBox.buttonText')}
        </Button>
      </form>
    );
  }
}

export default injectT(SearchBox);
