import React from "react";
import { Button, Form, Navbar } from "react-bootstrap";
import Link from "next/link";

const NavBar: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Link href="/">
        <Navbar.Brand href="#home">PCN Reporting Tool</Navbar.Brand>
      </Link>
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
