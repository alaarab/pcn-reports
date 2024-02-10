import React from "react";
import { Button, Form, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";

const NavBar: React.FC = () => {
  return (
    <Navbar expand="lg" className="mx-3">
      <Navbar.Brand className="">PCN Patient Lookup</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} href="/patientSearch">
          Patients
        </Nav.Link>
        <Nav.Link as={Link} href="/guarantorSearch">
          Guarantors
        </Nav.Link>
        <Nav.Link as={Link} href="/reports">
          Reports
        </Nav.Link>
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
