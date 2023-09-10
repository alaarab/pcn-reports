import React from "react";
import { Button, Form, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";

const NavBar: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>PCN Patient Lookup</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} href="/patientSearch">Patients</Nav.Link>
        <Nav.Link as={Link} href="/guarantorSearch">Guarantors</Nav.Link>
      </Nav>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
      <Form>
        <Link href={{ pathname: `/api/auth/logout` }}>
          <Button variant="outline-success">Sign Out</Button>
        </Link>
      </Form>
    </Navbar>
  );
};

export default NavBar;
