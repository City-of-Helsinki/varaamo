import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Overlay from 'react-bootstrap/lib/Overlay';

import { injectT } from 'i18n';
import SearchControlOverlay from './SearchControlOverlay';

class SearchBox extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  state = {
    searchOptions: [],
    visible: false,
  }

  handleChange = (event) => {
    const { onChange, options } = this.props;
    const value = event.target.value.toLowerCase();
    const searchOptions = value ? options.filter(option => (
      option.label.toLowerCase().indexOf(value) >= 0
    )) : [];
    onChange(event.target.value);
    this.setState({ searchOptions, visible: Boolean(searchOptions.length) });
  }

  handleSelect = (value) => {
    this.props.onChange(value);
    this.hideOverlay();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSearch();
  }

  hideOverlay = () => {
    this.setState({ searchOptions: [], visible: false });
  }

  showOverlay = () => {
    this.setState({ visible: true });
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
        <Overlay
          container={this}
          onHide={this.hideOverlay}
          placement="bottom"
          rootClose
          show={this.state.visible}
        >
          <SearchControlOverlay
            onHide={this.hideOverlay}
            title={t('DatePickerControl.header')}
          >
            <ListGroup>
              {this.state.searchOptions.map(option =>
                <ListGroupItem key={option.label} onClick={() => this.handleSelect(option.label)}>
                  {option.label}
                </ListGroupItem>
              )}
            </ListGroup>
          </SearchControlOverlay>
        </Overlay>
      </form>
    );
  }
}

export default injectT(SearchBox);
