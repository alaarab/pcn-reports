import Axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

const Patient: React.FC = (props) => {
  const router = useRouter();
  const { patientNumber } = router.query;
  const { data: patient } = useSWR(`/api/patient/${patientNumber}`)

  return <>{JSON.stringify(patient)}</>;
};

export default Patient;
