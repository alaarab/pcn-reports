import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsReport = () => {
  // needs to show a list of reports, guarantor report, patient report, and transaction report
  return (
    <div>
      <h1>Reports</h1>
      <ul>
        <li>
          <a href="/api/reports/patient">Patient Report</a>
        </li>
        <li>
          <a href="/api/reports/guarantor">Guarantor Report</a>
        </li>
        <li>
          <a href="/api/reports/transactions">Transaction Report</a>
        </li>
      </ul>
    </div>
  );
};

export default TransactionsReport;
