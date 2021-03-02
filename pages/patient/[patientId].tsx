import Axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import NavBar from "components/NavBar";
import _ from "lodash";
import { useInput } from "hooks/useInput";
import { formatAmount, formatMMDDYYYY } from "assets/util";
import Link from "next/link";

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

interface CorrectionProps {
  patientMutate: any;
  data: {
    id: number;
    patientId: string;
    amount: number;
    date: string;
    notes: string;
  };
}

interface NewCorrectionProps {
  patientId: string;
  patientMutate: any;
}

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
    lineNumber: number;
    legacyId: string;
    diagId: string;
    diagCode: DiagCodeProps["data"];
  };
  claimId: string;
  assignment: Array<AssignmentProps["data"]>;
}

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

interface DiagCodeProps {
  data: {
    id: string;
    legacyId: string;
    description: string;
    diagCodeLegacy: DiagCodeLegacyProps["data"];
  };
}

interface DiagCodeLegacyProps {
  data: {
    id: string;
    legacyId: string;
    description: string;
  };
}

export function patientAmount(patient) {
  let visitTotal = patient.visit
    .map((visit) => {
      let chargeAmount = visit.charge
        .map((e) => e.amount)
        .reduce((a, b) => a + b, 0);
      let assignmentAmount = visit.assignment
        .map((e) => e.amount)
        .reduce((a, b) => a + b, 0);
      let visitAmount = chargeAmount.toFixed(2) - assignmentAmount.toFixed(2);
      return visitAmount;
    })
    .reduce((a, b) => a + b, 0);
  let correctionTotal = patient.correction
    .map((correction) => parseFloat(correction.amount))
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
  return visitTotal + correctionTotal;
}

const Patient: React.FC = () => {
  const router = useRouter();
  const { patientId } = router.query;
  const { data: patient, mutate: patientMutate } = useSWR(
    `/api/patient/${patientId}`
  );

  return (
    <>
      {patient && (
        <>
          <Row className="mb-3 mt-3 justify-content-end">
            <Col>
              <div>Patient #: {patient.id}</div>
              <div>
                Guarantor #:{" "}
                <Link
                  href={{
                    pathname: "/guarantor/[slug]",
                    query: { slug: patient.guarantor.id },
                  }}
                >
                  {patient.guarantor.id}
                </Link>
              </div>
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
              <div>D.O.B: {formatMMDDYYYY(patient.dob)}</div>
              <div>Home: {patient.phone}</div>
              <div>Work: {patient.workPhone}</div>
              <div>Class: {patient.class}</div>
            </Col>
          </Row>

          <Row className="mb-3 mt-3 justify-content-end">
            {patient.patientPlan.map((patientPlan) => (
              <PatientPlan data={patientPlan} key={patientPlan.id} />
            ))}
          </Row>

          <Row className="mb-3 mt-3 justify-content-end">
            <Col>Patient Total: {formatAmount(patientAmount(patient))}</Col>
          </Row>

          <h6>Visits</h6>
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

          <h6>Corrections</h6>
          <Table size="sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Notes</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {patient.correction.map((correction) => (
                <Correction
                  data={correction}
                  key={correction.id}
                  patientMutate={patientMutate}
                />
              ))}
            </tbody>
          </Table>
          <h6>Add Correction</h6>
          <NewCorrection patientId={patient.id} patientMutate={patientMutate} />
        </>
      )}
      {!patient && <Spinner animation="grow" />}
    </>
  );
};

const Visit: React.FC<VisitProps> = (props) => {
  let chargeAmount = props.data.charge
    .map((e) => e.amount)
    .reduce((a, b) => a + b, 0);
  let assignmentAmount = props.data.assignment
    .map((e) => e.amount)
    .reduce((a, b) => a + b, 0);
  let visitAmount = chargeAmount - assignmentAmount;
  return (
    <>
      <tbody>
        {props.data.charge.map((charge) => (
          <Charge
            data={charge}
            key={charge.legacyId}
            claimId={props.data.claimId}
            assignment={props.data.assignment.filter(
              (e) => e.chargeLine === charge.lineNumber
            )}
          />
        ))}
      </tbody>
      <tfoot>
        <tr style={{ fontWeight: "bold" }}>
          <td></td>
          <td>Office:</td>
          <td>{props.data.locationId}</td>
          <td>
            {props.data.charge[0]?.diagCode?.diagCodeLegacy?.id}-
            {props.data.charge[0]?.diagCode?.diagCodeLegacy?.description}
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td>{formatAmount(visitAmount)}</td>
        </tr>
      </tfoot>
    </>
  );
};

const Charge: React.FC<ChargeProps> = (props) => {
  return (
    <>
      <tr>
        <td>{formatMMDDYYYY(props.data.fromServiceDate)}</td>
        <td>{props.claimId}</td>
        <td>{props.data.providerId}</td>
        <td colSpan={2}>
          {props.data.procedureId}-{props.data.procedure.description}
        </td>
        <td>{props.data.placeOfService}</td>
        <td></td>
        <td>{formatAmount(props.data.amount)}</td>
      </tr>
      {_.orderBy(props.assignment, "glAccountCodeId", "desc").map(
        (assignment) => (
          <Assignment data={assignment} key={assignment.id} />
        )
      )}
    </>
  );
};

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

const Correction: React.FC<CorrectionProps> = (props) => {
  const [message, setMessage] = useState("");

  async function performDestroy() {
    let confirm = window.confirm(
      "Are you sure you want to delete this correction? This action cannot be reversed."
    );

    if (confirm) {
      Axios.post(`/api/patient/removeCorrection`, {
        correctionId: props.data.id,
      }).then(function (res) {
        if (res.status === 200) {
          props.patientMutate();
        } else {
          setMessage("Try again!");
        }
      });
    }
  }

  return (
    <>
      <tr>
        <td>{formatMMDDYYYY(props.data.date)}</td>
        <td>{props.data.notes}</td>
        <td>{formatAmount(props.data.amount)}</td>
        <td>
          <Button variant="danger" onClick={performDestroy}>
            Delete
          </Button>
        </td>
      </tr>
    </>
  );
};

const NewCorrection: React.FC<NewCorrectionProps> = (props) => {
  const { value: date, bind: bindDate, reset: resetDate } = useInput("");
  const { value: amount, bind: bindAmount, reset: resetAmount } = useInput("");
  const { value: notes, bind: bindNotes, reset: resetNotes } = useInput("");
  const [message, setMessage] = useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    performCreate();
    resetDate();
    resetAmount();
    resetNotes();
  };

  async function performCreate() {
    Axios.post(`/api/patient/addCorrection`, {
      patientId: props.patientId,
      date,
      amount,
      notes,
    }).then(function (res) {
      if (res.status === 200) {
        props.patientMutate();
      } else {
        setMessage("Try again!");
      }
    });
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicDate">
          <Form.Label>Date</Form.Label>
          <Form.Control
            name="date"
            type="date"
            placeholder="Enter date"
            required={true}
            {...bindDate}
          />
        </Form.Group>
        <Form.Group controlId="formBasicAmount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            name="amount"
            type="amount"
            placeholder="Amount"
            {...bindAmount}
          />
        </Form.Group>
        <Form.Group controlId="formBasicNotes">
          <Form.Label>Notes</Form.Label>
          <Form.Control
            name="notes"
            type="notes"
            placeholder="Notes"
            {...bindNotes}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {message}
    </>
  );
};

export default Patient;
