import React, { useEffect, useState, useMemo } from "react";
import { Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { dateFormatter, amountFormatter } from "components/BootstrapTable";
import BootstrapTable from "components/BootstrapTable";

const CorrectionSearch = () => {
  // make start and end date default to the current month, not current date
  const [state, setState] = useState(() => {
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    return {
      startDate: firstDayOfMonth,
      endDate: lastDayOfMonth,
    };
  });
  const [corrections, setCorrections] = useState([]);
  const [correctionsCount, setCorrectionsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);

  const columns = [
    {
      dataField: "date",
      label: "Date",
      formatter: dateFormatter,
    },
    {
      dataField: "patientName",
      label: "Patient Name",
    },
    {
      dataField: "guarantorName",
      label: "Guarantor Name",
    },
    {
      dataField: "amount",
      label: "Amount",
    },
    {
      dataField: "patientBalance",
      label: "Patient Balance",
      formatter: amountFormatter,
    },
    {
      dataField: "guarantorBalance",
      label: "Guarantor Balance",
      formatter: amountFormatter,
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

  let correctionsParams = useMemo(
    () => ({
      params: {
        start: state.startDate,
        end: state.endDate,
        page,
        sizePerPage,
      },
    }),
    [state, page, sizePerPage]
  );

  const handleDownloadCsv = async () => {
    try {
      const response = await axios.get("/api/corrections/search", {
        params: {
          start: state.startDate,
          end: state.endDate,
          format: "csv", // additional parameter to indicate the format
        },
        responseType: "blob", // important for handling the binary data of the CSV file
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "corrections.csv"); // Set the file name
      document.body.appendChild(link);
      link.click(); // Trigger the download
      link.parentNode.removeChild(link); // Clean up
    } catch (error) {
      console.error("Error downloading CSV", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/corrections/search", correctionsParams);
      setCorrections(result.data.rows);
      setCorrectionsCount(result.data.count);
    };
    fetchData();
  }, [correctionsParams]);

  return (
    <>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="date"
              placeholder="Start Date"
              name="startDate"
              value={state.startDate}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Control
              type="date"
              placeholder="End Date"
              name="endDate"
              value={state.endDate}
              onChange={handleChange}
            />
          </Col>
        </Row>
      </Form>
      {corrections && (
        <BootstrapTable
          keyField="id"
          data={corrections}
          columns={columns}
          onTableChange={handleTableChange}
          currentPage={page}
          sizePerPage={sizePerPage}
          totalSize={correctionsCount}
        />
      )}
    </>
  );
};

export default CorrectionSearch;
