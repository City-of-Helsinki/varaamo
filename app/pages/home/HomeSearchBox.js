import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';

import { injectT } from 'i18n';


class HomeSearchBox extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({ value: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSearch(this.state.value);
  }

  render() {
    const { t } = this.props;
    return (
      <form className="app-HomeSearchBox" onSubmit={this.handleSubmit}>
        <FormControl
          className="app-HomeSearchBox__textfield"
          onChange={this.handleChange}
          placeholder={t('HomeSearchBox.searchPlaceholder')}
          type="text"
        />
        <Button
          bsStyle="primary"
          className="app-HomeSearchBox__button"
          type="submit"
        >
          {t('HomeSearchBox.buttonText')}
        </Button>
      </form>
    );
  }
}

export default injectT(HomeSearchBox);
