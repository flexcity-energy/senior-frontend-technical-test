import { Table } from "@tanstack/react-table";
import { Pagination } from "react-bootstrap";

interface TablePaginationProps<T extends object> {
  table: Table<T>;
}

const TablePagination = <T extends object>({
  table,
}: TablePaginationProps<T>) => {
  return (
    <Pagination className="justify-content-center">
      <Pagination.First
        onClick={() => {
          table.setPageIndex(0);
        }}
        disabled={!table.getCanPreviousPage()}
      />

      <Pagination.Prev
        onClick={() => {
          table.previousPage();
        }}
        disabled={!table.getCanPreviousPage()}
      />

      <Pagination.Item active>
        {table.getState().pagination.pageIndex + 1}
      </Pagination.Item>

      <Pagination.Next
        onClick={() => {
          table.nextPage();
        }}
        disabled={!table.getCanNextPage()}
      />

      <Pagination.Last
        onClick={() => {
          table.setPageIndex(table.getPageCount() - 1);
        }}
        disabled={!table.getCanNextPage()}
      />
    </Pagination>
  );
};

export default TablePagination;
