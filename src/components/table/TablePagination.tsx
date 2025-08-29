import { Table } from "@tanstack/react-table";
import { Pagination } from "react-bootstrap";

/**
 * Table pagination props
 */
interface TablePaginationProps<T extends object> {
  /**
   * Table instance return by useTable Hook
   */
  table: Table<T>;
}

/**
 * Table pagination component
 */
const TablePagination = <T extends object>({
  table,
}: TablePaginationProps<T>) => {
  return (
    <Pagination className="justify-content-center">
      {/* First page button */}
      <Pagination.First
        onClick={() => {
          table.setPageIndex(0);
        }}
        disabled={!table.getCanPreviousPage()}
      />

      {/* Previous page button */}
      <Pagination.Prev
        onClick={() => {
          table.previousPage();
        }}
        disabled={!table.getCanPreviousPage()}
      />

      {/* Current page */}
      <Pagination.Item active>
        {table.getState().pagination.pageIndex + 1}
      </Pagination.Item>

      {/* Next page button */}
      <Pagination.Next
        onClick={() => {
          table.nextPage();
        }}
        disabled={!table.getCanNextPage()}
      />

      {/* Last page button */}
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
