import React, { useState } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import PatientSearch from "components/PatientSearch";

const App: React.FC = () => {
  return (
    <Container className="p-3">
      <Jumbotron>
        <h1 className="header">PCN Reporting Tool</h1>
      </Jumbotron>
      <PatientSearch />
    </Container>
  );
};

export default App;
