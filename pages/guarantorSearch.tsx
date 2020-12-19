import { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
// ...
const RemotePagination = ({
  data,
  page,
  sizePerPage,
  onTableChange,
  totalSize,
}) => (
  <div>
    <PaginationProvider
      pagination={paginationFactory({
        custom: true,
        page,
        sizePerPage,
        totalSize,
      })}
    >
      {({ paginationProps, paginationTableProps }) => (
        <div>
          <div>
            <p>Current Page: {paginationProps.page}</p>
            <p>Current SizePerPage: {paginationProps.sizePerPage}</p>
          </div>
          <div>
            <PaginationListStandalone {...paginationProps} />
          </div>
          <BootstrapTable
            remote
            keyField="id"
            data={data}
            columns={columns}
            onTableChange={onTableChange}
            {...paginationTableProps}
          />
        </div>
      )}
    </PaginationProvider>
  </div>
);

function Container(props) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(products.slice(0, 10));
  const [size, setSizePerPage] = useState(10);

  const handleTableChange = (type, { page, sizePerPage }) => {
    const currentIndex = (page - 1) * sizePerPage;
    setTimeout(() => {
      setPage(page);
      setData(products.slice(currentIndex, currentIndex + sizePerPage));
      setSizePerPage(sizePerPage);
    }, 2000);
  };

  return (
    <RemotePagination
      data={data}
      page={page}
      sizePerPage={sizePerPage}
      totalSize={products.length}
      onTableChange={handleTableChange}
    />
  );
}
