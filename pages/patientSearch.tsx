import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { formatMMDDYYYY } from "assets/util";
import BootstrapTable from "components/BootstrapTable";

const PatientSearch: React.FC = () => {
  const [state, setState] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });
  const [patients, setPatients] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);


  const columns = [
    {
      dataField: "id",
      label: "Id",
      formatter: patientIdFormatter,
    },
    {
      dataField: "firstName",
      label: "First Name",
    },
    {
      dataField: "middleName",
      label: "Middle Name",
    },
    {
      dataField: "lastName",
      label: "Last Name",
    },
    {
      dataField: "dob",
      label: "Date of Birth",
      formatter: dateFormatter,
    },
  ];  

  function handleChange(evt) {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  }

  const handleTableChange = (type, { page, sizePerPage }) => {
    const currentIndex = (page - 1) * sizePerPage;
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  let patientsParam = useMemo(
    () => ({
      params: {
        id: state.id,
        firstName: state.firstName,
        middleName: state.middleName,
        lastName: state.lastName,
        page,
        sizePerPage,
      },
    }),
    [state, page, sizePerPage]
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/patient/search", patientsParam);
      setPatients(result.data.rows);
      setPatientsCount(result.data.count);
    };
    fetchData();
  }, [state, page, sizePerPage]);

  return (
    <>
      <Form>
        <Row className="mb-3">
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
              placeholder="Last name"
              name="lastName"
              value={state.lastName}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </Form>
      {patients && (
        <BootstrapTable
          keyField="id"
          data={patients}
          columns={columns}
          onTableChange={handleTableChange}
          currentPage={page}
          sizePerPage={sizePerPage}
          totalSize={patientsCount}
        />
      )}
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

function dateFormatter(cell) {
  return formatMMDDYYYY(cell);
}

export default PatientSearch;
