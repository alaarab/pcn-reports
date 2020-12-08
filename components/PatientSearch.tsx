import React, { useEffect, useMemo, useState } from "react";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Col, Form } from "react-bootstrap";
import Link from "next/link";
import axios from "axios";

const PatientSearch: React.FC = () => {
  const [state, setState] = React.useState({
    patientId: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });

  const [patients, setPatients] = useState([]);

  let patientsParam = useMemo(
    () => ({
      params: {
        patientId: state.patientId,
        firstName: state.firstName,
        middleName: state.middleName,
        lastName: state.lastName,
      },
    }),
    [state]
  );

  const columns = [
    {
      dataField: "patientId",
      text: "Patient Id",
      formatter: patientIdFormatter,
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
    {
      dataField: "dob",
      text: "Date of Birth",
    },
  ];

  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/patient/search", patientsParam);
      setPatients(result.data);
    };
    fetchData();
  }, [state]);

  return (
    <>
      <Form>
        <Form.Row className='mb-3'>
          <Col>
            <Form.Control
              placeholder="Patient Number"
              name="patientId"
              value={state.patientId}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              placeholder="First name"
              name="firstName"
              value={state.firstName}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              placeholder="Middle name"
              name="middleName"
              value={state.middleName}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              placeholder="Last name"
              name="lastName"
              value={state.lastName}
              onChange={handleChange}
            />
          </Col>
        </Form.Row>
      </Form>
      <BootstrapTable
        keyField="id"
        data={patients || []}
        columns={columns}
        pagination={paginationFactory()}
      />
    </>
  );
};

function patientIdFormatter(cell) {
  return (
    <Link href={{ pathname: "/patient/[slug]", query: { slug: cell } }}>
      {cell}
    </Link>
  );
}

export default PatientSearch;
