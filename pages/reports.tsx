import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Container, Modal, Spinner } from "react-bootstrap";
import { useInput } from "hooks/useInput";

const getFirstDayOfCurrentMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1)
    .toISOString()
    .split("T")[0];
};

const getLastDayOfCurrentMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];
};

const Reports = () => {
  const [showModal, setShowModal] = useState(false);
  const [patientReportStatus, setPatientReportStatus] = useState("Loading");
  const [guarantorReportStatus, setGuarantorReportStatus] = useState("Loading");
  const [patientReportLink, setPatientReportLink] = useState("");
  const [guarantorReportLink, setGuarantorReportLink] = useState("");
  const { value: startDate, bind: bindStartDate } = useInput(
    getFirstDayOfCurrentMonth()
  );
  const { value: endDate, bind: bindEndDate } = useInput(
    getLastDayOfCurrentMonth()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("/api/reports/status/patient")
        .then((response) => {
          const { status, fileName } = response.data;
          setPatientReportStatus(status);
          if (status === "Ready") {
            setPatientReportLink(`/api/reports/download/${fileName}`);
          }
        })
        .catch((error) => {
          console.error("Error checking patient report status:", error);
        });

      axios
        .get("/api/reports/status/guarantor")
        .then((response) => {
          const { status, fileName } = response.data;
          setGuarantorReportStatus(status);
          if (status === "Ready") {
            setGuarantorReportLink(`/api/reports/download/${fileName}`);
          }
        })
        .catch((error) => {
          console.error("Error checking guarantor report status:", error);
        });
    }, 2000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const generateReport = (reportType) => {
    if (reportType === "patient") {
      setPatientReportStatus("Generating");
    } else {
      setGuarantorReportStatus("Generating");
    }
    axios
      .get(`/api/reports/${reportType}`)
      .then((response) => {
        if (reportType === "patient") {
          setPatientReportStatus("Generating");
          setPatientReportLink("");
        } else {
          setGuarantorReportStatus("Generating");
          setGuarantorReportLink("");
        }
      })
      .catch((error) => {
        console.error(`Error generating ${reportType} report:`, error);
      });
  };

  const handleReportClick = (event) => {
    event.preventDefault();
    const url = `/api/reports/corrections?start=${startDate}&end=${endDate}`;
    window.location.href = url;
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Reports</h1>
      <div className="d-flex flex-column align-items-start">
        {patientReportStatus === "Ready" ? (
          <>
            <a href={patientReportLink} className="btn btn-success mb-2">
              Download Patient Report
            </a>
            <Button
              variant="primary"
              onClick={() => generateReport("patient")}
              className="mb-2"
            >
              Generate Patient Report
            </Button>
          </>
        ) : patientReportStatus === "Not Generated" ? (
          <Button
            variant="primary"
            onClick={() => generateReport("patient")}
            className="mb-2"
          >
            Generate Patient Report
          </Button>
        ) : patientReportStatus === "Loading" ? (
          <Spinner animation="border" />
        ) : (
          <>
            <span>Generating Patient Report...</span>
            <Button
              variant="secondary"
              onClick={() => generateReport("patient")}
              className="mb-2"
            >
              Generate Patient Report
            </Button>
          </>
        )}

        {guarantorReportStatus === "Ready" ? (
          <>
            <a href={guarantorReportLink} className="btn btn-success mb-2">
              Download Guarantor Report
            </a>
            <Button
              variant="primary"
              onClick={() => generateReport("guarantor")}
              className="mb-2"
            >
              Generate Guarantor Report
            </Button>
          </>
        ) : guarantorReportStatus === "Not Generated" ? (
          <Button onClick={() => generateReport("guarantor")} className="mb-2">
            Generate Guarantor Report
          </Button>
        ) : guarantorReportStatus === "Loading" ? (
          <Spinner animation="border" />
        ) : (
          <>
            <span>Generating Guarantor Report...</span>
            <Button
              variant="secondary"
              onClick={() => generateReport("guarantor")}
              className="mb-2"
            >
              Generate Guarantor Report
            </Button>
          </>
        )}

        <a href="#" onClick={() => setShowModal(true)} className="mb-2">
          Correction Report
        </a>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Correction Report Parameters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReportClick}>
            <Form.Group controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                name="startDate"
                type="date"
                required={true}
                {...bindStartDate}
              />
            </Form.Group>
            <Form.Group controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                name="endDate"
                type="date"
                required={true}
                {...bindEndDate}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Generate Corrections Report
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Reports;
