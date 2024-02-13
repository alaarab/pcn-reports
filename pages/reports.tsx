import React, { useState } from "react";
import { Form, Button, Container, Modal } from "react-bootstrap";
import { useInput } from "hooks/useInput";

const getFirstDayOfCurrentMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
};

const getLastDayOfCurrentMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
};

const Reports = () => {
  const [showModal, setShowModal] = useState(false);
  const { value: startDate, bind: bindStartDate } = useInput(getFirstDayOfCurrentMonth());
  const { value: endDate, bind: bindEndDate } = useInput(getLastDayOfCurrentMonth());

  const handleReportClick = (event) => {
    event.preventDefault();
    const url = `/api/reports/corrections?start=${startDate}&end=${endDate}`;
    window.location.href = url;
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-3">Reports</h1>
      <div className="d-flex flex-column align-items-start">
        <a href="/api/reports/patient" className="mb-2">
          Patient Report
        </a>
        <a href="/api/reports/guarantor" className="mb-2">
          Guarantor Report
        </a>
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
