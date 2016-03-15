import React, { Component } from 'react';
import Input from 'react-bootstrap/lib/Input';

class PreliminaryReservationForm extends Component {
  render() {
    return (
      <div>
        <form className="form-horizontal">
          <p>
            Täytä vielä seuraavat tiedot alustavaa varausta varten.
            Tähdellä (*) merkityt kentät ovat pakollisia.
          </p>
          <Input
            label="Nimi*"
            labelClassName="col-xs-3"
            type="text"
            wrapperClassName="col-xs-9"
          />
          <Input
            label="Sähköposti*"
            labelClassName="col-xs-3"
            type="email"
            wrapperClassName="col-xs-9"
          />
          <Input
            label="Puhelin*"
            labelClassName="col-xs-3"
            type="text"
            wrapperClassName="col-xs-9"
          />
          <Input
            label="Tilaisuuden kuvaus*"
            labelClassName="col-xs-3"
            rows="5"
            type="textarea"
            wrapperClassName="col-xs-9"
          />
          <Input
            label="Osoite*"
            labelClassName="col-xs-3"
            type="text"
            wrapperClassName="col-xs-9"
          />
        </form>
      </div>
    );
  }
}

PreliminaryReservationForm.propTypes = {};

export default PreliminaryReservationForm;
