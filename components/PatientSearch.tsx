import React, { useState } from "react";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import useSWR from "swr";
import { Button, Col, Form } from "react-bootstrap";
import Link from "next/link";

const PatientSearch: React.FC = () => {
  const { data: patients } = useSWR("/api/patient/search");
  const columns = [
    {
      dataField: "patientNumber",
      text: "Patient Number",
      formatter: patientNumberFormatter,
    },
    {
      dataField: "firstName",
      text: "First Name",
    },
    {
      dataField: "middleName",
      text: "Middle Name",
    },
    {
      dataField: "lastName",
      text: "Last Name",
    },
  ];

  return (
    <>
      {/* <Form>
        <Form.Row>
          <Col>
            <Form.Control placeholder="First name" />
          </Col>
          <Col>
            <Form.Control placeholder="Middle name" />
          </Col>
          <Col>
            <Form.Control placeholder="Last name" />
          </Col>
        </Form.Row>
      </Form> */}
      <BootstrapTable
        keyField="id"
        data={patients?.data || []}
        columns={columns}
        pagination={paginationFactory()}
      />
      {JSON.stringify(patients)}
    </>
  );
};

function patientNumberFormatter(cell, row) {
  return (
    <Link href={{ pathname: "/patient/[slug]", query: { slug: cell } }}>
      {cell}
    </Link>
  );
}

export default PatientSearch;
