import React, { useState } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import PatientSearch from "components/PatientSearch";

const App: React.FC = () => {
  return (
    <>
      <Container className="p-3">
        <PatientSearch />
      </Container>
    </>
  );
};

export default App;
