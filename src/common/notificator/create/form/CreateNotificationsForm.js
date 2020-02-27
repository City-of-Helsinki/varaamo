import React, { useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import Select from 'react-select';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { createSelectOptions } from '../../utils';
import NotificationDatePicker from '../../date/NotificatorDatePicker';

const CreateNotificationsForm = (props) => {
  const formContainer = useRef();
  const [activeLanguage, setActiveLanguage] = useState('fi');

  const {
    addElement, addNew, isEditing, newNotification, onFieldChange,
  } = props;

  const { targetOptions, urgencyOptions, activeOptions } = createSelectOptions();
  const languageButtons = ['fi', 'en', 'sv'];
  // Because this component is used inside modal, count dimensions and set sm value based on that
  const current = formContainer.current;
  let dimensions = {
    width: 601,
  };
  if (current) {
    dimensions = current.getBoundingClientRect();
  }

  return (
    <div ref={formContainer}>
      {!isEditing && (
        <React.Fragment>
          <div className="button-row">
            <button onClick={() => firebase.auth().signOut()} type="button">Sign out</button>
          </div>
          <h4>Create new notification</h4>
        </React.Fragment>
      )}
      <Row>
        <Col sm={dimensions && dimensions.width > 600 ? 3 : 12}>
          <span>Name</span>
          <input
            onChange={event => onFieldChange(event, 'name')}
            value={newNotification.name || ''}
          />
        </Col>
        <Col sm={dimensions && dimensions.width > 600 ? 3 : 12}>
          <span>Target</span>
          <Select
            className="app-Select"
            classNamePrefix="app-Select"
            onChange={event => onFieldChange({ target: { value: event } }, 'target')}
            options={targetOptions}
            placeholder="Select"
            value={newNotification.target}
          />
        </Col>
        <Col sm={dimensions && dimensions.width > 600 ? 3 : 12}>
          <span>Urgency</span>
          <Select
            className="app-Select"
            classNamePrefix="app-Select"
            onChange={event => onFieldChange({ target: { value: event } }, 'urgency')}
            options={urgencyOptions}
            placeholder="Select"
            value={newNotification.urgency}
          />
        </Col>
        <Col sm={dimensions && dimensions.width > 600 ? 3 : 12}>
          <span>Until</span>
          <NotificationDatePicker
            date={newNotification.until}
            onChange={onFieldChange}
          />
        </Col>
        {isEditing && (
          <Col sm={dimensions && dimensions.width > 600 ? 3 : 12}>
            <span>Active</span>
            <Select
              className="app-Select"
              classNamePrefix="app-Select"
              onChange={event => onFieldChange({ target: { value: event } }, 'active')}
              options={activeOptions}
              placeholder="Select"
              value={newNotification.active}
            />
          </Col>
        )}
      </Row>
      <Row className="action-row">
        <Col sm={12}>
          <button
            onClick={() => addElement('<a href="http://" target="_blank">Text</a>', activeLanguage)}
            type="button"
          >
            {'</a>'}
          </button>

          <button
            onClick={() => addElement('<b></b>', activeLanguage)}
            type="button"
          >
            {'<b>'}
          </button>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <div className="language-row">
            {languageButtons.map(lang => (
              <button
                className={classNames('language-button', {
                  'active': activeLanguage === lang,
                })}
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                type="submit"
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <textarea
            onChange={event => onFieldChange(event, 'message', activeLanguage)}
            placeholder={`Notification message for ${activeLanguage.toUpperCase()}`}
            rows={5}
            value={(newNotification.message && newNotification.message[activeLanguage]) || ''}
          />
        </Col>
      </Row>
      <Row>
        <Col className="button-row" sm={12}>
          {!isEditing && <button onClick={addNew} type="submit">Add</button>}
        </Col>
      </Row>

    </div>
  );
};

CreateNotificationsForm.propTypes = {
  addElement: PropTypes.func.isRequired,
  addNew: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  newNotification: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

export default CreateNotificationsForm;
