import React from "react";
import { Button, Form, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";

const NavBar: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Link href="/">
        <Navbar.Brand>PCN Patient Lookup</Navbar.Brand>
      </Link>
      <Nav className="mr-auto">
        <Link href="/patientSearch" passHref>
          <Nav.Link>Patients</Nav.Link>
        </Link>
        <Link href="/guarantorSearch" passHref>
          <Nav.Link>Guarantors</Nav.Link>
        </Link>
      </Nav>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
      <Form inline>
        <Link href={{ pathname: `/api/auth/logout` }}>
          <Button variant="outline-success">Sign Out</Button>
        </Link>
      </Form>
    </Navbar>
  );
};

export default NavBar;
