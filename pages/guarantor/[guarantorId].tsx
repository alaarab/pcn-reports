import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Col, Row, Spinner } from "react-bootstrap";
import Link from "next/link";
import { patientAmount } from "pages/patient/[patientId]";
import { formatAmount } from "assets/util";

const Guarantor: React.FC = () => {
  const router = useRouter();
  const { guarantorId } = router.query;

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: guarantor } = useSWR(`/api/guarantor/${guarantorId}`, fetcher);

  function guarantorAmount(guarantor) {
    return guarantor.patient
      .map((patient) => patientAmount(patient))
      .reduce((a, b) => a + b, 0);
  }

  return (
    <>
      {guarantor && (
        <>
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
              <div>
                Practice: {guarantor.practice?.name}
              </div>
            </Col>
            <Col>
              <div>D.O.B: {guarantor.dob}</div>
              <div>Home: {guarantor.phone}</div>
              <div>Work: {guarantor.workPhone}</div>
            </Col>
          </Row>

          <Row className="mb-3 mt-3 justify-content-end">
            <Col>
              Guarantor Total: {formatAmount(guarantorAmount(guarantor))}
            </Col>
          </Row>

          <h2>Patients</h2>
          {guarantor.patient.map((patient) => (
            <Patient data={patient} key={patient.id} />
          ))}
        </>
      )}
      {!guarantor && <Spinner animation="grow" />}
    </>
  );
};

interface PatientProps {
  data: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const Patient: React.FC<PatientProps> = (props) => {
  return (
    <p>
      <Link
        href={{ pathname: "/patient/[slug]", query: { slug: props.data.id } }}
      >
        {props.data.firstName + " " + props.data.lastName}
      </Link>{" "}
      - {formatAmount(patientAmount(props.data))}
    </p>
  );
};

export default Guarantor;
