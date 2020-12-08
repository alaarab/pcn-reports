import Axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Col, Row } from "react-bootstrap";

const Patient: React.FC = (props) => {
  const router = useRouter();
  const { patientNumber } = router.query;
  const { data: patient } = useSWR(`/api/patient/${patientNumber}`);

  function printDocument() {
    const input = document.getElementById("divToPrint");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", [297, 210]);
      pdf.addImage(imgData, "PNG", 10, 10);
      // pdf.output('dataurlnewwindow');
      pdf.save("download.pdf");
    });
  }

  return (
    <>
      <Row className="mb-3 mt-3 justify-content-end">
        <Col className="justify-content-end">
          <button onClick={printDocument} className="justify-content-end">Print</button>
        </Col>
      </Row>
      <div id="divToPrint">{JSON.stringify(patient)}</div>
    </>
  );
};

export default Patient;
