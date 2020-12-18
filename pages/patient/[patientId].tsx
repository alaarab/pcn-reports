import Axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Col, Row } from "react-bootstrap";

const Patient: React.FC = (props) => {
  const router = useRouter();
  const { patientId } = router.query;
  const { data: patient } = useSWR(`/api/patient/${patientId}`);

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
      {patient && (
        <>
          <Row className="mb-3 mt-3 justify-content-end">
            <Col className="justify-content-end">
              <button onClick={printDocument} className="justify-content-end">
                Print
              </button>
            </Col>
          </Row>
          <div id="divToPrint">
            <h2>Patient Information</h2>
            <Row className="mb-3 mt-3 justify-content-end">
              <Col>
                <div>Patient #: {patient.id}</div>
                <div>Guarantor #: {patient.guarantor.id}</div>
                <div>
                  Guarantor Name: {patient.guarantor.lastName}, {patient.guarantor.firstName}{" "}
                  {patient.guarantor.middleName}
                </div>
              </Col>
              <Col>
                <div>
                  Patient Name: {patient.lastName}, {patient.firstName}{" "}
                  {patient.middleName}
                </div>
                <div>{patient.address}</div>
                <div>
                  {patient.city}, {patient.state} {patient.zip}
                </div>
              </Col>
              <Col>
                <div>D.O.B: {patient.dob}</div>
                <div>Home: {patient.phone}</div>
                <div>Work: {patient.workPhone}</div>
                {/* class: {patient.class} */}
              </Col>
            </Row>

            <h2>Visits</h2>
            {patient.visit.map((visit) => (
              <Visit data={visit} key={visit.id} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

const Visit: React.FC = (props) => {
  return (
    <>
      <h4>Visit {props.data.visitId}</h4>
      {props.data.charge.map((charge) => (
        <Charge data={charge} key={charge.legacyId} />
      ))}
      {props.data.payment.map((payment) => (
        <Payment data={payment} key={payment.id} />
      ))}
      {props.data.planCoverage.map((planCoverage) => (
        <PlanCoverage data={planCoverage} key={planCoverage.id} />
      ))}
    </>
  );
};

const Charge: React.FC = (props) => {
  return (
    <>
      <h4>Charge: </h4>
      Charge Amount: {props.data.amount}
      <br />
      Charge Approved Amount: {props.data.approvedAmount}
      <br />
    </>
  );
};

const Payment: React.FC = (props) => {
  return (
    <>
      <h4>Payment: </h4>
      Payment Id: {props.data.paymentId}
      <br />
      Guarantor Id: {props.data.guarantorId}
      <br />
      Plan Id: {props.data.insurancePlanId}
      <br />
      Post Date: {props.data.postDate}
      <br />
      Reference Date: {props.data.referenceDate}
      <br />
      Amount: {props.data.amount}
      <br />
      Voucher Id: {props.data.voucherId}
      <br />
      Legacy Id: {props.data.legacyId}
      <br />
    </>
  );
};

const PlanCoverage: React.FC = (props) => {
  return (
    <>
      <h4>Plan Coverage: </h4>
      Visit Id: {props.data.visitId}
      <br />
      Legacy Id: {props.data.legacyId}
      <br />
      Group Id: {props.data.groupId}
      <br />
      Performing Provider: {props.data.performingProviderId}
      <br />
      Procedure: {props.data.procedure.description}
      <br />
      Amount: {props.data.amount}
      <br />
    </>
  );
};

export default Patient;
