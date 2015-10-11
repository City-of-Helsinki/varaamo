import React from 'react';
import { Navbar as RBNavbar, Nav, NavBrand, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

export class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <RBNavbar toggleNavKey={0}>
        <NavBrand><Link to={'/'}>Respa</Link></NavBrand>
        <Nav eventKey={0} right>
          <LinkContainer to="/search">
            <NavItem>Haku</NavItem>
          </LinkContainer>
        </Nav>
      </RBNavbar>
    );
  }
}

Navbar.propTypes = {};

export default Navbar;
