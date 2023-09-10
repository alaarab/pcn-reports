import React, { useEffect } from "react";
import { Table, Pagination, Dropdown, Row, Col } from "react-bootstrap";

interface Column {
  dataField: string;
  label: string;
  formatter?: (cell: number | string, row: any) => JSX.Element;
}

interface BootstrapTableProps {
  keyField: string;
  data: any[];
  columns: Column[];
  onTableChange: (type: string, { page, sizePerPage }: { page: number, sizePerPage: number }) => void;
  currentPage: number;
  sizePerPage: number;
  totalSize: number;
}

const BootstrapTable: React.FC<BootstrapTableProps> = ({
  keyField,
  data,
  columns,
  onTableChange,
  currentPage,
  sizePerPage,
  totalSize,
}) => {
  const totalPages = Math.ceil(totalSize / sizePerPage);

  useEffect(() => {
    onTableChange("pagination", { page: currentPage, sizePerPage });
  }, [data, currentPage, sizePerPage, onTableChange]);

  const handlePageChange = (page: number) => {
    onTableChange("pagination", { page, sizePerPage });
  };

  const handleSizePerPageChange = (newSize: number) => {
    onTableChange("pagination", { page: 1, sizePerPage: newSize });
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row[keyField]}>
              {columns.map((col, colIdx) => (
                <td key={colIdx}>
                  {col.formatter ? col.formatter(row[col.dataField], row) : row[col.dataField]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Row>
      <Col>
        <Pagination>
          <Pagination.Item onClick={() => handlePageChange(1)}>
            {"<<"}
          </Pagination.Item>
          <Pagination.Prev onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} />

          {Array.from({ length: 10 }, (_, i) => currentPage + i - 4).map((page) => (
            (page > 0 && page <= totalPages) ? (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Pagination.Item>
            ) : null
          ))}

          <Pagination.Next onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} />
          <Pagination.Item onClick={() => handlePageChange(totalPages)}>
            {">>"}
          </Pagination.Item>
        </Pagination>
      </Col>



        <Col className="d-flex justify-content-end">
          <Dropdown
            onSelect={(e: string | null) => handleSizePerPageChange(Number(e))}
          >
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Rows per page: {sizePerPage}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="5">5</Dropdown.Item>
              <Dropdown.Item eventKey="10">10</Dropdown.Item>
              <Dropdown.Item eventKey="20">20</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </>
  );
};

export default BootstrapTable;
