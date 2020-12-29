import Axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Col, Row, Table } from "react-bootstrap";
import NavBar from "components/NavBar";
import _ from "lodash";
import { formatAmount, formatMMDDYYYY } from "assets/util";

const Patient: React.FC = () => {
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
              {/* <button onClick={printDocument} className="justify-content-end">
                Print
              </button> */}
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
                <div>Class: {patient.class}</div>
              </Col>
            </Row>

            <h2>Insurance Plans</h2>

            <Row className="mb-3 mt-3 justify-content-end">
              {patient.patientPlan.map((patientPlan) => (
                <PatientPlan data={patientPlan} key={patientPlan.id} />
              ))}
            </Row>

            <Table size="sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bill #</th>
                  <th>Dr.</th>
                  <th>CPT/Procedure</th>
                  <th>Check #:Plan</th>
                  <th>POS</th>
                  <th>Notes</th>
                  <th>Charge</th>
                </tr>
              </thead>
              {patient.visit.map((visit) => (
                <Visit data={visit} key={visit.id} />
              ))}
            </Table>
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
  };
}

const Visit: React.FC<VisitProps> = (props) => {
  let chargeAmount = props.data.charge
    .map((e) => parseFloat(e.amount.toString()))
    .reduce((a, b) => a + b, 0);
  let assignmentAmount = props.data.assignment
    .map((e) => parseFloat(e.amount.toString()))
    .reduce((a, b) => a + b, 0);
  return (
    <>
      {props.data.charge.map((charge) => (
        <Charge
          data={charge}
          key={charge.legacyId}
          claimId={props.data.claimId}
        />
      ))}
      {_.orderBy(
        props.data.assignment,
        ["chargeLine", "glAccountCodeId"],
        ["asc", "desc"]
      ).map((assignment) => (
        <Assignment data={assignment} key={assignment.id} />
      ))}
      <tr style={{ fontWeight: "bold" }}>
        <td></td>
        <td>Office:</td>
        <td>{props.data.locationId}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>
          {formatAmount(
            parseFloat(chargeAmount.toString()) -
              parseFloat(assignmentAmount.toString())
          )}
        </td>
      </tr>
    </>
  );
};

interface ChargeProps {
  data: {
    amount: number;
    approvedAmount: number;
    procedureId: string;
    procedure: ProcedureProps["data"];
    providerId: string;
    fromServiceDate: Date;
    toServiceDate: Date;
    placeOfService: string;
    postDate: Date;
    generalNote: string;
    legacyId: string;
  };
  claimId: string;
}

const Charge: React.FC<ChargeProps> = (props) => {
  return (
    <>
      <tr>
        <td>{formatMMDDYYYY(props.data.postDate)}</td>
        <td>{props.claimId}</td>
        <td>{props.data.providerId}</td>
        <td colSpan={2}>
          {props.data.procedureId}-{props.data.procedure.description}
        </td>
        <td></td>
        <td></td>
        <td>{formatAmount(props.data.amount)}</td>
      </tr>
    </>
  );
};

interface ProcedureProps {
  data: {
    displayId: string;
    description: string;
    type: string;
    amount: number;
  };
}

interface AssignmentProps {
  data: {
    id: string;
    chargeLine: number;
    activityCount: number;
    assingmentType: string;
    payment: PaymentProps["data"];
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
      <tr>
        <td>
          {props.data.payment?.referenceDate
            ? formatMMDDYYYY(props.data.payment?.referenceDate)
            : ""}
        </td>
        <td></td>
        <td></td>
        <td colSpan={3}>
          {props.data.glAccountCodeId == "wri" ? "Writeoff" : ""}
          {props.data.payment
            ? `PAYMENT-${formatMMDDYYYY(props.data.payment.postDate)}: ${
                props.data.payment.insurancePlan?.name
              }`
            : ""}
        </td>
        <td>{props.data.payment ? props.data.payment.notes : ""}</td>
        <td>{formatAmount(props.data.amount)}-</td>
      </tr>
    </>
  );
};

interface PaymentProps {
  data: {
    id: string;
    guarantorId: string;
    insurancePlanId: string;
    insurancePlan: {
      name: string;
    };
    postDate: Date;
    referenceDate: Date;
    amount: number;
    voucherId: string;
    notes: string;
    visitId: string;
  };
}

interface PatientPlanProps {
  data: {
    id: number;
    patientId: string;
    insurancePlanId: string;
    insurancePlan: {
      name: string;
    };
    groupId: string;
    memberId: string;
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

export default Patient;
