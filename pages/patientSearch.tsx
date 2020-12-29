import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Form } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import axios from "axios";
import { formatMMDDYYYY } from "assets/util";

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
      text: "Id",
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
        <Form.Row className="mb-3">
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
        </Form.Row>
      </Form>
      {patients && (
        <RemotePagination
          data={patients}
          page={page}
          sizePerPage={sizePerPage}
          totalSize={patientsCount}
          onTableChange={handleTableChange}
          columns={columns}
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

const RemotePagination = ({
  data,
  page,
  sizePerPage,
  onTableChange,
  totalSize,
  columns,
}) => (
  <div>
    <BootstrapTable
      remote
      keyField="id"
      data={data}
      columns={columns}
      onTableChange={onTableChange}
      pagination={paginationFactory({
        page,
        sizePerPage, 
        totalSize,
      })}
    />
  </div>
);
