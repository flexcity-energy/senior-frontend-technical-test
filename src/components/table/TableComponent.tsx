import { useState } from "react";
import { Table } from "react-bootstrap";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TablePagination from "./TablePagination";
import TableFilter from "./TableFilter";

/**
 * Table component props
 */
interface TableComponentProps<T extends object> {
  /**
   * Columns
   */
  columns: Array<ColumnDef<T>>;

  /**
   * Data
   */
  data: T[];
}

/**
 * Table component for showing data in table with paging and filtering
 */
const TableComponent = <T extends object>({
  columns,
  data,
}: TableComponentProps<T>) => {
  const [globalFilter, setGlobalFilter] = useState("");

  // Set the columns, data, pagination and filtering settings to build the table
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: { pageSize: 5 },
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <TableFilter
        className="my-3"
        value={globalFilter ?? ""}
        onChange={(value) => setGlobalFilter(String(value))}
      />
      <Table striped>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {
                // Loop over the headers
                headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {
                      // Render header column
                      header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                    }
                  </th>
                ))
              }
            </tr>
          ))}
        </thead>
        <tbody>
          {
            // Loop over the rows
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {
                      // Render row
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    }
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </Table>
      <TablePagination table={table} />
    </>
  );
};

export default TableComponent;
