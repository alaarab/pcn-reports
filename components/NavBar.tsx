import React, { useEffect, useMemo, useState } from "react";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import useSWR from "swr";
import {
  Button,
  Col,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import Link from "next/link";
import axios from "axios";

const NavBar: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Link href="/">
        <Navbar.Brand href="#home">PCN Reporting Tool</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
      <Form inline>
        <Button variant="outline-success">Sign Out</Button>
      </Form>
    </Navbar>
  );
};

function patientNumberFormatter(cell, row) {
  return (
    <Link href={{ pathname: "/patient/[slug]", query: { slug: cell } }}>
      {cell}
    </Link>
  );
}

export default NavBar;
