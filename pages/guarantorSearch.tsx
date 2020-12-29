import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Form } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import axios from "axios";

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
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      dataField: "id",
      text: "Id",
      formatter: guarantorIdFormatter,
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

  const handleTableChange = (type, { page, pageSize }) => {
    
    const currentIndex = (page - 1) * pageSize;
    setPage(page);
    setPageSize(pageSize);
    console.log(page, pageSize)
  };

  let guarantorsParam = useMemo(
    () => ({
      params: {
        id: state.id,
        firstName: state.firstName,
        middleName: state.middleName,
        lastName: state.lastName,
        page,
        pageSize,
      },
    }),
    [state, page, pageSize]
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/guarantor/search", guarantorsParam);
      setGuarantors(result.data.rows);
      setGuarantorsCount(result.data.count);
    };
    fetchData();
  }, [state, page, pageSize]);

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
      {guarantors && (
        <RemotePagination
          data={guarantors}
          page={page}
          pageSize={pageSize}
          totalSize={guarantorsCount}
          onTableChange={handleTableChange}
          columns={columns}
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

const RemotePagination = ({
  data,
  page,
  pageSize,
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
      pagination={paginationFactory({ page, pageSize, totalSize })}
    />
  </div>
);
