import Axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Col, Row } from "react-bootstrap";

const Guarantor: React.FC = (props) => {
  const router = useRouter();
  const { guarantorId } = router.query;
  const { data: guarantor } = useSWR(`/api/guarantor/${guarantorId}`);

  function printDocument() {
    const input = document.getElementById("divToPrint");
    // html2canvas(input).then((canvas) => {
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF("p", "mm", [297, 210]);
    //   pdf.addImage(imgData, "PNG", 10, 10);
    //   // pdf.output('dataurlnewwindow');
    //   pdf.save("download.pdf");
    // });
  }

  return (
    <>
      {guarantor && (
        <>
          <Row className="mb-3 mt-3 justify-content-end">
            <Col className="justify-content-end">
              <button onClick={printDocument} className="justify-content-end">
                Print
              </button>
            </Col>
          </Row>
          <div id="divToPrint">
            <h2>Guarantor Information</h2>
            <Row className="mb-3 mt-3 justify-content-end">
              <Col>
                <div>Guarantor #: {guarantor.id}</div>
                <div>
                  Guarantor Name: {guarantor.lastName}, {guarantor.firstName}{" "}
                  {guarantor.middleName}
                </div>
                <div>{guarantor.address}</div>
                <div>
                  {guarantor.city}, {guarantor.state} {guarantor.zip}
                </div>
              </Col>
              <Col>
                <div>D.O.B: {guarantor.dob}</div>
                <div>Home: {guarantor.phone}</div>
                <div>Work: {guarantor.workPhone}</div>
              </Col>
            </Row>

            <h2>Patients</h2>
            {guarantor.patient.map((patient) => (
              <Patient data={patient} key={patient.id} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

const Patient: React.FC = (props) => {
  return (
    <>
      <h4>Patient {props.data.patientId}</h4>
      <b>Patient Name:</b> {props.data.firstName}{" "}
      {props.data.lastName}
      <br />
    </>
  );
};

export default Guarantor;
