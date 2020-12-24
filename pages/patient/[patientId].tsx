import Axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Col, Row } from "react-bootstrap";
import NavBar from "components/NavBar";

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
                  Guarantor Name: {patient.guarantor.lastName},{" "}
                  {patient.guarantor.firstName} {patient.guarantor.middleName}
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

            <h2>Insurance Plans</h2>

            <Row className="mb-3 mt-3 justify-content-end">
              {patient.patientPlan.map((patientPlan) => (
                <PatientPlan data={patientPlan} key={patientPlan.id} />
              ))}
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

interface VisitProps {
  data: {
    id: string;
    locationId: string;
    providerId: string;
    claimId: string;
    charge: Array<ChargeProps["data"]>;
    assignment: Array<AssignmentProps["data"]>;
    payment: Array<PaymentProps["data"]>;
    // planCoverage: [object];
  };
}

const Visit: React.FC<VisitProps> = (props) => {
  return (
    <>
      <h4>Visit {props.data.id}</h4>
      <b>locationId</b> {props.data.locationId}
      <br />
      <b>providerId</b> {props.data.providerId}
      <br />
      <b>claimId</b> {props.data.claimId}
      <br />
      {props.data.charge.map((charge) => (
        <Charge data={charge} key={charge.legacyId} />
      ))}
      {props.data.assignment.map((assignment) => (
        <Assignment data={assignment} key={assignment.id} />
      ))}
      {props.data.payment.map((payment) => (
        <Payment data={payment} key={payment.id} />
      ))}
      {/* {props.data.planCoverage.map((planCoverage) => (
        <PlanCoverage data={planCoverage} key={planCoverage.id} />
      ))} */}
    </>
  );
};

interface ChargeProps {
  data: {
    amount: number;
    approvedAmount: number;
    procedureId: string;
    providerId: string;
    fromServiceDate: Date;
    toServiceDate: Date;
    postDate: Date;
    generalNote: string;
    legacyId: string;
  };
}

const Charge: React.FC<ChargeProps> = (props) => {
  return (
    <>
      <h4>Charge: </h4>
      Charge Amount: {props.data.amount}
      <br />
      Charge Approved Amount: {props.data.approvedAmount}
      <br />
      Charge Procedure: {props.data.procedureId}
      <br />
      Charge Provider: {props.data.providerId}
      <br />
      Charge fromServiceDate: {props.data.fromServiceDate}
      <br />
      Charge toServiceDate: {props.data.toServiceDate}
      <br />
      Charge postDate: {props.data.postDate}
      <br />
    </>
  );
};

interface AssignmentProps {
  data: {
    id: string;
    chargeLine: number;
    activityCount: number;
    assingmentType: string;
    paymentId: string;
    amount: number;
    postDate: Date;
    glAccountCodeId: string;
    unappliedCreditNumber: string;
    transferToInsuranceCreditedPlan: string;
    legacyId: string;
  };
}

const Assignment: React.FC<AssignmentProps> = (props) => {
  return (
    <>
      <h4>Assignment: </h4>
      Assignment Amount: {props.data.amount}
      <br />
      Assignment Post Date: {props.data.postDate}
      <br />
      GL Account Code: {props.data.glAccountCodeId}
      <br />
    </>
  );
};

interface PaymentProps {
  data: {
    id: string;
    guarantorId: string;
    insurancePlanId: string;
    postDate: Date;
    referenceDate: Date;
    amount: number;
    voucherId: string;
    visitId: string;
    paymentId: string;
    legacyId: string;
  };
}

const Payment: React.FC<PaymentProps> = (props) => {
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

interface PatientPlanProps {
  data: {
    id: number,
    patientId: string,
    insurancePlanId: string,
    insurancePlan: {
      name: string,
    },
    groupId: string,
    memberId: string,
  };
}

const PatientPlan: React.FC<PatientPlanProps> = (props) => {
  return (
    <Col>
      Insurance Plan: {props.data.insurancePlan.name}
      <br />
      Policy #: {props.data.memberId}
      <br />
      Group #: {props.data.groupId}
    </Col>
  );
};

// interface PlanCoverageProps {
//   data: {
//     visitId: string,
//     legacyId: string,
//     groupId: string,
//     performingProviderId: string,
//     procedure: {
//       description: string,
//     },
//     amount: number,
//   }
// }

// const PlanCoverage: React.FC<PlanCoverageProps> = (props) => {
//   return (
//     <>
//       <h4>Plan Coverage: </h4>
//       Visit Id: {props.data.visitId}
//       <br />
//       Legacy Id: {props.data.legacyId}
//       <br />
//       Group Id: {props.data.groupId}
//       <br />
//       Performing Provider: {props.data.performingProviderId}
//       <br />
//       Procedure: {props.data.procedure.description}
//       <br />
//       Amount: {props.data.amount}
//       <br />
//     </>
//   );
// };

export default Patient;
