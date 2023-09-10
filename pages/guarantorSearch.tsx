import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import BootstrapTable from "components/BootstrapTable";

const GuarantorSearch: React.FC = () => {
  const [state, setState] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
  });
  const [guarantors, setGuarantors] = useState([]);
  const [guarantorsCount, setGuarantorsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);

  const columns = [
    {
      dataField: "id",
      label: "Id",
      formatter: guarantorIdFormatter,
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
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  let guarantorsParam = useMemo(
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
      const result = await axios("/api/guarantor/search", guarantorsParam);
      setGuarantors(result.data.rows);
      setGuarantorsCount(result.data.count);
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
      {guarantors && (
        <BootstrapTable
          keyField="id"
          data={guarantors}
          columns={columns}
          onTableChange={handleTableChange}
          currentPage={page}
          sizePerPage={sizePerPage}
          totalSize={guarantorsCount}
        />
      )}
    </>
  );
};

function guarantorIdFormatter(cell) {
  return (
    <Link href={{ pathname: "/guarantor/[slug]", query: { slug: cell } }}>
      {cell}
    </Link>
  );
}

export default GuarantorSearch;